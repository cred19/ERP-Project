from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    staff = "staff"

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.staff

class User(UserBase):
    id: int
    role: UserRole
    class Config:
        orm_mode = True

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class Category(CategoryBase):
    id: int
    class Config:
        orm_mode = True

class SupplierBase(BaseModel):
    name: str
    email: EmailStr
    contact: Optional[str] = None
    address: Optional[str] = None

class Supplier(SupplierBase):
    id: int
    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    name: str
    sku: str
    category_id: int
    unit: str
    price: float
    quantity_in_stock: int
    reorder_threshold: int
    supplier_id: Optional[int] = None

class Product(ProductBase):
    id: int
    class Config:
        orm_mode = True

class CustomerBase(BaseModel):
    name: str
    contact: Optional[str] = None
    address: Optional[str] = None

class Customer(CustomerBase):
    id: int
    class Config:
        orm_mode = True

class SaleItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class SaleItem(SaleItemBase):
    id: int
    class Config:
        orm_mode = True

class SaleBase(BaseModel):
    customer_id: Optional[int]
    total: float

class Sale(SaleBase):
    id: int
    date: datetime
    items: List[SaleItem] = []
    class Config:
        orm_mode = True

class PurchaseItemBase(BaseModel):
    product_id: int
    quantity: int
    cost: float

class PurchaseItem(PurchaseItemBase):
    id: int
    class Config:
        orm_mode = True

class PurchaseBase(BaseModel):
    supplier_id: Optional[int]
    total: float

class Purchase(PurchaseBase):
    id: int
    date: datetime
    items: List[PurchaseItem] = []
    class Config:
        orm_mode = True

class OrderStatus(str, Enum):
    created = "created"
    sent = "sent"
    confirmed = "confirmed"
    received = "received"
    cancelled = "cancelled"

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItem(OrderItemBase):
    id: int
    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    supplier_id: int
    total: float
    auto_generated: bool = False
    requirement_by_date: datetime
    payment_mode: str
    delivery_address: str

class Order(OrderBase):
    id: int
    order_date: datetime
    status: OrderStatus
    items: List[OrderItem] = []
    class Config:
        orm_mode = True