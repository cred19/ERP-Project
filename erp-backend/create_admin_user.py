import sqlite3
from passlib.context import CryptContext

DB_PATH = "/app/erp.db"  # Change this path if your db is elsewhere in the container

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash("yourpassword")  # <-- Change to your desired password

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute(
    "INSERT INTO users (username, hashed_password, role) VALUES (?, ?, ?)",
    ("admin", hashed_password, "admin")
)
conn.commit()
conn.close()

print("Admin user created!")