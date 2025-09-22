from fastapi import Request
from database import get_db_connection_from_request_headers

def read_tables(request: Request, db_name: str):
    conn = get_db_connection_from_request_headers(request.headers)
    cursor = conn.cursor()
    try:
        # SQLite
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    except Exception:
        # MySQL
        cursor.execute("SHOW TABLES;")
    tables = cursor.fetchall()
    conn.close()
    # Normalize output for both DBs
    table_names = []
    for row in tables:
        if isinstance(row, (list, tuple)):
            table_names.append(row[0])
        else:
            # MySQL connector may return dicts if configured; fallback
            table_names.append(list(row.values())[0])
    return {"tables": table_names}