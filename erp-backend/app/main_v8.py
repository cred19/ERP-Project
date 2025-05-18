from fastapi import FastAPI
from app.routers import (
    users_v8 as users, inventory_v8 as inventory, suppliers_v8 as suppliers,
    orders_v8 as orders, barcode_v8 as barcode, reports_v8 as reports,
    bulk_import_v8 as bulk_import, export_v8 as export
)
from app.database_v8 import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(users.router, prefix="/users")
app.include_router(inventory.router, prefix="/inventory")
app.include_router(suppliers.router, prefix="/suppliers")
app.include_router(orders.router, prefix="/orders")
app.include_router(barcode.router, prefix="/barcode")
app.include_router(reports.router, prefix="/reports")
app.include_router(bulk_import.router, prefix="/bulk_import")
app.include_router(export.router, prefix="/export")