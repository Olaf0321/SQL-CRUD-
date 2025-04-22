from fastapi import Request
from database import get_db_connection

def read_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print(tables)
    conn.close()
    return {"tables": [table[0] for table in tables]}