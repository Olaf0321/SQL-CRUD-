from fastapi import APIRouter, Request
from controllers import list_column_controller

router = APIRouter()

@router.get("/")
def get_list_column():
    return list_column_controller.read_column_controller()
