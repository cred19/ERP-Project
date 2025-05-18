from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database_v8 import SessionLocal
from app.models_v8 import Product
from app.utils.barcode_utils_v8 import generate_barcode

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/product/{product_id}/image")
def get_product_barcode(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    image_bytes = generate_barcode(product.sku)
    return Response(content=image_bytes, media_type="image/png")