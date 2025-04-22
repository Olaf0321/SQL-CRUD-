# init_db.py
import sqlite3
import os

def init_db():
    # Ensure the data directory exists
    os.makedirs("data", exist_ok=True)

    # Connect to the database inside the 'data' folder
    db_path = os.path.join("data", "database.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS 商品 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            名前 TEXT NOT NULL,
            説明 TEXT NOT NULL
        )
    ''')

    # Optional: Insert sample Japanese data
    cursor.execute("INSERT INTO 商品 (名前, 説明) VALUES (?, ?)", ("サンプル商品1", "説明1"))
    cursor.execute("INSERT INTO 商品 (名前, 説明) VALUES (?, ?)", ("サンプル商品2", "説明2"))

    # Create table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS スタッフ (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            名前 TEXT NOT NULL,
            説明 TEXT NOT NULL,
            その他 TEXT NOT NULL
        )
    ''')

    # Optional: Insert sample Japanese data
    cursor.execute("INSERT INTO スタッフ (名前, 説明, その他) VALUES (?, ?, ?)", ("サンプル商品1", "説明1", "サンプル"))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
