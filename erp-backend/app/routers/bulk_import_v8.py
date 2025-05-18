from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database_v8 import SessionLocal
from app.models_v8 import Product, Supplier
import pandas as pd
import io

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/products/")
async def import_products(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    df = pd.read_excel(io.BytesIO(contents))
    for _, row in df.iterrows():
        product = Product(
            name=row['name'],
            sku=row['sku'],
            category_id=row['category_id'],
            unit=row['unit'],
            price=row['price'],
            quantity_in_stock=row['quantity_in_stock'],
            reorder_threshold=row['reorder_threshold'],
            supplier_id=row.get('supplier_id')
        )
        db.add(product)
    db.commit()
    return {"message": "Products imported"}

@router.post("/suppliers/")
async def import_suppliers(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    df = pd.read_excel(io.BytesIO(contents))
    for _, row in df.iterrows():
        supplier = Supplier(
            name=row['name'],
            email=row['email'],
            contact=row.get('contact'),
            address=row.get('address')
        )
        db.add(supplier)
    db.commit()
    return {"message": "Suppliers imported"}