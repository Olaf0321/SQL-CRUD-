from fastapi import APIRouter, Request
from controllers import fkcolumnName_controller

router = APIRouter()

@router.get("/{parentTableName}/{selectedTableName}")
def get_fkcolumnName(parentTableName: str, selectedTableName: str, request: Request):
    return fkcolumnName_controller.get_fkcolumnName(request, parentTableName, selectedTableName)