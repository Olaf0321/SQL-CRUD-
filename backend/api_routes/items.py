from fastapi import APIRouter, Request
from controllers import items_controller

router = APIRouter()

@router.get("/{tableName}")
def get_table_records(tableName):
    return items_controller.read_table_records(tableName)

@router.post("/{table_name}")
def create_table_record(table_name: str, record: dict):
    return items_controller.create_table_record(table_name, record)

@router.put("/{table_name}/{record_id}")
def update_table_record(table_name: str, record_id: int, record: dict):
    return items_controller.update_table_record(table_name, record_id, record)

@router.delete("/{table_name}/{record_id}")
def delete_table_record(table_name: str, record_id: int):
    return items_controller.delete_table_record(table_name, record_id)