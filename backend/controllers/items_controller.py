from fastapi import Request
from database import get_db_connection_from_request_headers

def read_table_records(request: Request, db_name: str, table_name: str):
    conn = get_db_connection_from_request_headers(request.headers)
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM `{table_name}`;")
    rows = cursor.fetchall()
    # Capture column names in a DB-agnostic way
    column_names = [desc[0] for desc in cursor.description]
    conn.close()
    records = [dict(zip(column_names, row)) for row in rows]
    # Normalize primary key naming: ensure 'ID' exists if 'id' is present
    for rec in records:
        if 'ID' not in rec and 'id' in rec:
            rec['ID'] = rec['id']
    return {"records": records}

def create_table_record(request: Request, db_name: str, table_name: str, record: dict):
    conn = get_db_connection_from_request_headers(request.headers)
    cursor = conn.cursor()

    # Remove primary key if present in payload
    if 'ID' in record:
        record.pop('ID')
    if 'id' in record:
        record.pop('id')
    columns = ', '.join([f"`{k}`" for k in record.keys()])
    values = tuple(record.values())
    try:
        # Try SQLite style placeholders first
        placeholders = ', '.join(['?'] * len(record))
        query = f"INSERT INTO `{table_name}` ({columns}) VALUES ({placeholders})"
        cursor.execute(query, values)
    except Exception:
        # Fallback to MySQL style %s
        placeholders = ', '.join(['%s'] * len(record))
        query = f"INSERT INTO `{table_name}` ({columns}) VALUES ({placeholders})"
        cursor.execute(query, values)
    conn.commit()
    conn.close()
    return {"message": "Record added successfully"}

def update_table_record(request: Request, db_name: str, table_name: str, record_id: int, record: dict):
    conn = get_db_connection_from_request_headers(request.headers)
    cursor = conn.cursor()
    # Never update primary key
    if 'ID' in record:
        record.pop('ID')
    if 'id' in record:
        record.pop('id')
    try:
        updates = ', '.join([f"`{key}` = ?" for key in record])
        values = tuple(record.values()) + (record_id,)
        query = f"UPDATE `{table_name}` SET {updates} WHERE ID = ?"
        cursor.execute(query, values)
    except Exception:
        try:
            updates = ', '.join([f"`{key}` = %s" for key in record])
            values = tuple(record.values()) + (record_id,)
            query = f"UPDATE `{table_name}` SET {updates} WHERE ID = %s"
            cursor.execute(query, values)
        except Exception:
            # Fallback lowercase id
            try:
                updates = ', '.join([f"`{key}` = ?" for key in record])
                values = tuple(record.values()) + (record_id,)
                query = f"UPDATE `{table_name}` SET {updates} WHERE id = ?"
                cursor.execute(query, values)
            except Exception:
                updates = ', '.join([f"`{key}` = %s" for key in record])
                values = tuple(record.values()) + (record_id,)
                query = f"UPDATE `{table_name}` SET {updates} WHERE id = %s"
                cursor.execute(query, values)
    conn.commit()
    conn.close()
    return {"message": "Record updated successfully"}

def delete_table_record(request: Request, db_name: str, table_name: str, record_id: int):
    conn = get_db_connection_from_request_headers(request.headers)
    cursor = conn.cursor()
    try:
        query = f"DELETE FROM `{table_name}` WHERE ID = ?"
        cursor.execute(query, (record_id,))
    except Exception:
        try:
            query = f"DELETE FROM `{table_name}` WHERE ID = %s"
            cursor.execute(query, (record_id,))
        except Exception:
            try:
                query = f"DELETE FROM `{table_name}` WHERE id = ?"
                cursor.execute(query, (record_id,))
            except Exception:
                query = f"DELETE FROM `{table_name}` WHERE id = %s"
                cursor.execute(query, (record_id,))
    conn.commit()
    conn.close()
    return {"message": "Record deleted successfully"}