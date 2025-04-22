from fastapi import APIRouter, Request
from controllers import tables_controller

router = APIRouter()

@router.get("/")
def get_tables():
    return tables_controller.read_tables()
