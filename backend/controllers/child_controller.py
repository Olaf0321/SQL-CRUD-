from fastapi import Request
from database import get_db_connection
from initial_setting import child

def read_child():
    arr = child()
    print(arr)
    return {"child": arr}
