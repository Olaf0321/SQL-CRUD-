from fastapi import Request
from database import get_db_connection

def get_table_columns(table_name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns_info = cursor.fetchall()
    conn.close()
    columns = [col[1] for col in columns_info]  # Exclude ID
    return {"columns": columns}