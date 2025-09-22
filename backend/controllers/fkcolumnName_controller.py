from fastapi import Request
from database import get_db_connection_from_request_headers

def get_fkcolumnName(request: Request, parentTableName: str, selectedTableName: str) -> str:
    """
    Connects to MySQL using selectedDatabase info from request headers.
    Returns the foreign key column in selectedTableName that references parentTableName.
    If no such column exists, returns "".
    """
    conn = get_db_connection_from_request_headers(request.headers)
    cursor = conn.cursor()

    # Get current database name
    cursor.execute("SELECT DATABASE();")
    db_name = cursor.fetchone()[0]

    print(f"db_name: {db_name}")
    print(f"selectedTableName: {selectedTableName}")
    print(f"parentTableName: {parentTableName}")

    # Query INFORMATION_SCHEMA for foreign key relationships
    query = """
        SELECT kcu.COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
        WHERE kcu.TABLE_SCHEMA = %s
          AND kcu.TABLE_NAME = %s
          AND kcu.REFERENCED_TABLE_NAME = %s;
    """
    cursor.execute(query, (db_name, selectedTableName, parentTableName))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    if result:
        return result[0]  # foreign key column name
    else:
        return ""
