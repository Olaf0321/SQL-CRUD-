from fastapi import Request
from database import get_db_connection

def read_table_records(table_name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name};")
    records = cursor.fetchall()
    conn.close()
    return {"records": [dict(zip([column[0] for column in cursor.description], record)) for record in records]}

def create_table_record(table_name: str, record: dict):
    conn = get_db_connection()
    cursor = conn.cursor()

    columns = ', '.join(record.keys())
    placeholders = ', '.join(['?'] * len(record))
    values = tuple(record.values())

    query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
    cursor.execute(query, values)
    conn.commit()
    conn.close()

    return {"message": "Record added successfully"}

def update_table_record(table_name: str, record_id: int, record: dict):
    conn = get_db_connection()
    cursor = conn.cursor()

    updates = ', '.join([f"{key} = ?" for key in record])
    values = tuple(record.values()) + (record_id,)

    query = f"UPDATE {table_name} SET {updates} WHERE id = ?"
    cursor.execute(query, values)
    conn.commit()
    conn.close()

    return {"message": "Record updated successfully"}

def delete_table_record(table_name: str, record_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = f"DELETE FROM {table_name} WHERE id = ?"
    cursor.execute(query, (record_id,))
    conn.commit()
    conn.close()

    return {"message": "Record deleted successfully"}