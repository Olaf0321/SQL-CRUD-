from database import get_db_connection

def get_all_items():
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM items').fetchall()
    conn.close()
    return items

def get_item(item_id: int):
    conn = get_db_connection()
    item = conn.execute('SELECT * FROM items WHERE id = ?', (item_id,)).fetchone()
    conn.close()
    return item

def create_item(name: str, description: str):
    conn = get_db_connection()
    conn.execute('INSERT INTO items (name, description) VALUES (?, ?)', (name, description))
    conn.commit()
    conn.close()

def update_item(item_id: int, name: str, description: str):
    conn = get_db_connection()
    conn.execute('UPDATE items SET name = ?, description = ? WHERE id = ?', (name, description, item_id))
    conn.commit()
    conn.close()

def delete_item(item_id: int):
    conn = get_db_connection()
    conn.execute('DELETE FROM items WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
