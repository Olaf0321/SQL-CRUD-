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
        CREATE TABLE IF NOT EXISTS 従業員 (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            名前 TEXT NOT NULL,
            利点 TEXT NOT NULL
        )
    ''')

    # Optional: Insert sample Japanese data
    cursor.execute("INSERT INTO 従業員 (名前, 利点) VALUES (?, ?)", ("藤本", "システム開発"))
    cursor.execute("INSERT INTO 従業員 (名前, 利点) VALUES (?, ?)", ("中村", "ホームページ制作"))

    # Create table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS 商品 (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            名前 TEXT NOT NULL,
            価格 INTEGER NOT NULL,
            説明 TEXT NOT NULL
        )
    ''')

    # Optional: Insert sample Japanese data
    cursor.execute("INSERT INTO 商品 (名前, 価格, 説明) VALUES (?, ?, ?)", ("マウス", 15, "最新"))
    cursor.execute("INSERT INTO 商品 (名前, 価格, 説明) VALUES (?, ?, ?)", ("レシバ", 15, "最新"))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
