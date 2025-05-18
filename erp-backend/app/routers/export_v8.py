from fastapi import APIRouter, Depends, Response, Query
from sqlalchemy.orm import Session
from app.database_v8 import SessionLocal
from app.models_v8 import Product, Sale
from app.utils.reporting_v8 import inventory_to_excel, sales_to_excel
from datetime import datetime, timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/inventory/excel")
def export_inventory(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    data = [{
        "id": p.id,
        "name": p.name,
        "sku": p.sku,
        "quantity_in_stock": p.quantity_in_stock,
        "reorder_threshold": p.reorder_threshold,
        "price": p.price
    } for p in products]
    excel_bytes = inventory_to_excel(data)
    return Response(content=excel_bytes, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

@router.get("/sales/excel")
def export_sales(
    period: str = Query("this_month", enum=["today", "this_week", "this_month", "last_month", "last_3_months", "last_6_months", "custom"]),
    from_date: str = None, to_date: str = None,
    db: Session = Depends(get_db)
):
    now = datetime.now()
    if period == "today":
        from_dt = datetime(now.year, now.month, now.day)
        to_dt = now
    elif period == "this_week":
        from_dt = now - timedelta(days=now.weekday())
        to_dt = now
    elif period == "this_month":
        from_dt = datetime(now.year, now.month, 1)
        to_dt = now
    elif period == "last_month":
        last_month = now.month - 1 or 12
        year = now.year if now.month > 1 else now.year - 1
        from_dt = datetime(year, last_month, 1)
        to_dt = datetime(year, last_month, 28) + timedelta(days=4)
        to_dt = to_dt - timedelta(days=to_dt.day)
    elif period == "last_3_months":
        from_dt = now - timedelta(days=90)
        to_dt = now
    elif period == "last_6_months":
        from_dt = now - timedelta(days=180)
        to_dt = now
    elif period == "custom" and from_date and to_date:
        from_dt = datetime.strptime(from_date, "%Y-%m-%d")
        to_dt = datetime.strptime(to_date, "%Y-%m-%d")
    else:
        from_dt = datetime(now.year, now.month, 1)
        to_dt = now
    sales = db.query(Sale).filter(Sale.date >= from_dt, Sale.date <= to_dt).all()
    data = [{"id": s.id, "date": s.date, "total": s.total} for s in sales]
    excel_bytes = sales_to_excel(data)
    return Response(content=excel_bytes, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")