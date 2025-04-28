from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api_routes import items, tables, columns, child, list_column

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include item routes
app.include_router(items.router, prefix="/items", tags=["Items"])
app.include_router(tables.router, prefix="/tables", tags=["tables"])
app.include_router(columns.router, prefix="/columns", tags=["columns"])
app.include_router(child.router, prefix="/child", tags=["child"])
app.include_router(list_column.router, prefix="/list_column", tags=["list_column"])

# @app.get("/")
# async def root():
#     return {"message": "Welcome to the SQLite CRUD API."}