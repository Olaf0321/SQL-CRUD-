from fastapi import APIRouter, Request
from controllers import child_controller

router = APIRouter()

@router.get("/{db_name}")
def get_child(db_name: str, request: Request):
    return child_controller.read_child(request, db_name)
