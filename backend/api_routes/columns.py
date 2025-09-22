from fastapi import APIRouter, Request
from controllers import columns_controller

router = APIRouter()

@router.get("/{db_name}/{table_name}")
def get_table_columns(db_name: str, table_name: str, request: Request):
    return columns_controller.get_table_columns(request, db_name, table_name)