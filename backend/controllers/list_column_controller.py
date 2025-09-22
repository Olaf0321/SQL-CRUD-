from fastapi import Request
from database import get_db_connection_from_request_headers
from initial_setting import list_column

def read_column_controller(request: Request, db_name: str):
    # If in the future this depends on DB schema, headers are available
    _ = get_db_connection_from_request_headers(request.headers)
    arr = list_column()
    return {"list_column": arr}
