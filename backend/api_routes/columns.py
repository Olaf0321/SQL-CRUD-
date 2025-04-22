from fastapi import APIRouter, Request
from controllers import columns_controller

router = APIRouter()

@router.get("/{table_name}")
def get_table_columns(table_name: str):
    return columns_controller.get_table_columns(table_name)