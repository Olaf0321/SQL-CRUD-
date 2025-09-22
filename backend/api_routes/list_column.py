from fastapi import APIRouter, Request
from controllers import list_column_controller

router = APIRouter()

@router.get("/{db_name}")
def get_list_column(db_name: str, request: Request):
    return list_column_controller.read_column_controller(request, db_name)
