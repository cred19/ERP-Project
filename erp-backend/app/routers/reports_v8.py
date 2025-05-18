from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database_v8 import SessionLocal
from app.models_v8 import Sale, SaleItem, Product, Category
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_financial_year(date: datetime):
    year = date.year
    if date.month < 4:
        return f"{year-1}-{year}"
    else:
        return f"{year}-{year+1}"

@router.get("/sales")
def sales_report(from_date: str, to_date: str, db: Session = Depends(get_db)):
    from_dt = datetime.strptime(from_date, "%Y-%m-%d")
    to_dt = datetime.strptime(to_date, "%Y-%m-%d")
    results = (
        db.query(
            func.date(Sale.date).label("date"),
            func.sum(Sale.total).label("total_sales")
        )
        .filter(Sale.date >= from_dt, Sale.date <= to_dt)
        .group_by(func.date(Sale.date))
        .all()
    )
    return [{"date": str(row[0]), "sales": row[1]} for row in results]

@router.get("/sales/by_financial_year")
def sales_by_financial_year(db: Session = Depends(get_db)):
    results = db.query(Sale).all()
    fy_sales = {}
    for sale in results:
        fy = get_financial_year(sale.date)
        fy_sales.setdefault(fy, 0)
        fy_sales[fy] += sale.total
    return fy_sales

@router.get("/top-products")
def top_products_report(from_date: str, to_date: str, db: Session = Depends(get_db)):
    from_dt = datetime.strptime(from_date, "%Y-%m-%d")
    to_dt = datetime.strptime(to_date, "%Y-%m-%d")
    results = (
        db.query(
            Product.name,
            func.sum(SaleItem.quantity).label("total_sold")
        )
        .join(SaleItem, SaleItem.product_id == Product.id)
        .join(Sale, Sale.id == SaleItem.sale_id)
        .filter(Sale.date >= from_dt, Sale.date <= to_dt)
        .group_by(Product.id)
        .order_by(func.sum(SaleItem.quantity).desc())
        .limit(10)
        .all()
    )
    return [{"product": row[0], "quantity_sold": row[1]} for row in results]

@router.get("/category-sales")
def category_sales_report(from_date: str, to_date: str, db: Session = Depends(get_db)):
    from_dt = datetime.strptime(from_date, "%Y-%m-%d")
    to_dt = datetime.strptime(to_date, "%Y-%m-%d")
    results = (
        db.query(
            Category.name,
            func.sum(SaleItem.quantity * SaleItem.price).label("sales_amount")
        )
        .join(Product, Product.category_id == Category.id)
        .join(SaleItem, SaleItem.product_id == Product.id)
        .join(Sale, Sale.id == SaleItem.sale_id)
        .filter(Sale.date >= from_dt, Sale.date <= to_dt)
        .group_by(Category.id)
        .order_by(func.sum(SaleItem.quantity * SaleItem.price).desc())
        .all()
    )
    return [{"category": row[0], "sales_amount": row[1]} for row in results]