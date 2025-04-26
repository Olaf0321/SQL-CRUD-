from fastapi import Request
from database import get_db_connection
from initial_setting import list_column

def read_column_controller():
    arr = list_column()
    print(arr)
    return {"list_column": arr}
