from fastapi import Request
from database import get_db_connection_from_request_headers
from initial_setting import child

def read_child(request: Request, db_name: str):
    # If in the future child() depends on DB schema, headers are available
    _ = get_db_connection_from_request_headers(request.headers)
    arr = child()
    return {"child": arr}
