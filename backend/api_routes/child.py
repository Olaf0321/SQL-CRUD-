from fastapi import APIRouter, Request
from controllers import child_controller

router = APIRouter()

@router.get("/")
def get_child():
    return child_controller.read_child()
