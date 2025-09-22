from fastapi import Request
from database import get_db_connection_from_request_headers

def get_table_columns(request: Request, db_name: str, table_name: str):
    conn = get_db_connection_from_request_headers(request.headers)
    cursor = conn.cursor()
    try:
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns_info = cursor.fetchall()
        columns = [col[1] for col in columns_info]
    except Exception:
        # MySQL
        cursor.execute(f"DESCRIBE `{table_name}`")
        columns_info = cursor.fetchall()
        # mysql-connector returns tuples: Field, Type, Null, Key, Default, Extra
        columns = [row[0] for row in columns_info]
    finally:
        conn.close()
    return {"columns": columns}