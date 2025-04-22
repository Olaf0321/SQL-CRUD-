from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from database import get_db_connection

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/items/")
def read_items():
    conn = get_db_connection()
    cursor = conn.cursor()
    items = cursor.execute("SELECT * FROM items").fetchall()
    conn.close()
    return [dict(item) for item in items]

@app.post("/items/")
async def create_item(request: Request):
    data = await request.json()
    name = data.get("name before")  # You used this key name previously
    description = data.get("説明")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO items (名前, 説明) VALUES (?, ?)", (name, description))
    conn.commit()
    conn.close()

    return {"message": "Item created successfully"}

# --- DELETE ITEM ---
@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM items WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"message": f"Item with ID {item_id} deleted"}

# --- UPDATE ITEM ---
@app.put("/items/{item_id}")
async def update_item(item_id: int, request: Request):
    data = await request.json()
    name = data.get("name before")
    description = data.get("説明")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE items SET 名前 = ?, 説明 = ? WHERE id = ?", (name, description, item_id))
    conn.commit()
    conn.close()
    return {"message": f"Item with ID {item_id} updated"}
