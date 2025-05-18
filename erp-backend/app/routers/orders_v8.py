from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database_v8 import SessionLocal
from app.models_v8 import Order, OrderItem, OrderStatus, Product, Supplier
from app.schemas_v8 import OrderBase, Order as OrderSchema, OrderItemBase
from app.utils.email_v8 import send_order_email
from typing import List
from datetime import datetime, timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def estimate_runout_date(product: Product) -> datetime:
    # Dummy estimator: suppose 10 items sold/day. You can use your own logic here.
    if product.quantity_in_stock == 0:
        return datetime.now()
    days_left = max(product.quantity_in_stock // 10, 1)
    return datetime.now() + timedelta(days=days_left)

@router.post("/", response_model=OrderSchema)
def create_order(order: OrderBase, items: List[OrderItemBase], db: Session = Depends(get_db)):
    db_order = Order(
        supplier_id=order.supplier_id,
        total=order.total,
        auto_generated=order.auto_generated,
        requirement_by_date=order.requirement_by_date,
        payment_mode=order.payment_mode,
        delivery_address=order.delivery_address,
        status=OrderStatus.created
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    for item in items:
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
    db.commit()

    # Email supplier
    supplier = db.query(Supplier).filter(Supplier.id == order.supplier_id).first()
    body = f"""
    Order ID: {db_order.id}
    Order Date: {db_order.order_date}
    Items: {[(item.product_id, item.quantity, item.price) for item in items]}
    Total: {order.total}
    Requirement by: {order.requirement_by_date}
    Delivery address: {order.delivery_address}
    Payment mode: {order.payment_mode}
    """
    send_order_email(supplier.email, f"New Order #{db_order.id}", body)
    return db_order

@router.get("/", response_model=List[OrderSchema])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()