from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database_v8 import SessionLocal
from app.models_v8 import Product, Category
from app.schemas_v8 import Product as ProductSchema, ProductBase, CategoryBase, Category as CategorySchema
from typing import List
import pandas as pd
import io

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/category/", response_model=CategorySchema)
def create_category(category: CategoryBase, db: Session = Depends(get_db)):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/category/", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.post("/product/", response_model=ProductSchema)
def create_product(product: ProductBase, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/product/", response_model=List[ProductSchema])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.get("/alerts/", response_model=List[ProductSchema])
def get_stock_alerts(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.quantity_in_stock <= Product.reorder_threshold).all()

@router.post("/bulk_import/")
async def bulk_import_products(file: UploadFile = File(...), db: Session = Depends(get_db)):
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