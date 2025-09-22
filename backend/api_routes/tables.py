from fastapi import APIRouter, Request
from controllers import tables_controller

router = APIRouter()

@router.get("/{db_name}")
def get_tables(db_name: str, request: Request):
    return tables_controller.read_tables(request, db_name)
