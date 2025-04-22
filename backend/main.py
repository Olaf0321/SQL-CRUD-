from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api_routes import items, tables, columns

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