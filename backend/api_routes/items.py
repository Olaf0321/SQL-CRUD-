from fastapi import APIRouter, Request
from controllers import items_controller

router = APIRouter()

@router.get("/{db_name}/{tableName}")
def get_table_records(db_name: str, tableName: str, request: Request):
    return items_controller.read_table_records(request, db_name, tableName)

@router.post("/{db_name}/{table_name}")
def create_table_record(db_name: str, table_name: str, record: dict, request: Request):
    return items_controller.create_table_record(request, db_name, table_name, record)

@router.put("/{db_name}/{table_name}/{record_id}")
def update_table_record(db_name: str, table_name: str, record_id: int, record: dict, request: Request):
    return items_controller.update_table_record(request, db_name, table_name, record_id, record)

@router.delete("/{db_name}/{table_name}/{record_id}")
def delete_table_record(db_name: str, table_name: str, record_id: int, request: Request):
    return items_controller.delete_table_record(request, db_name, table_name, record_id)