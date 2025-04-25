from fastapi import Request
from database import get_db_connection
from child import child

def read_child():
    arr = child()
    return {child: arr}
