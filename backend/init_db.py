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
    # 営業マンテーブルの作成（新しい列「役職」を追加）
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS 営業マン (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            名前 TEXT NOT NULL,
            メール TEXT UNIQUE NOT NULL,
            役職 TEXT CHECK(役職 IN ('営業部長', '営業主任', '営業スタッフ'))  -- 役職はリストから選択
        )
    ''')

    # 顧客テーブルの作成（営業マンIDは外部キー）
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS 顧客 (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            名前 TEXT NOT NULL,
            住所 TEXT,
            営業マンID INTEGER,
            FOREIGN KEY (営業マンID) REFERENCES 営業マン(ID)
        )
    ''')

    # 営業マンのサンプルデータを追加（役職を追加）
    営業マンデータ = [
        ('山田太郎', 'taro@example.com', '営業部長'),
        ('鈴木花子', 'hanako@example.com', '営業主任'),
        ('田中一郎', 'ichiro@example.com', '営業スタッフ')
    ]
    cursor.executemany('INSERT INTO 営業マン (名前, メール, 役職) VALUES (?, ?, ?)', 営業マンデータ)

    # 顧客のサンプルデータを追加（それぞれの営業マンIDに対応）
    顧客データ = [
        ('顧客A', '東京', 1),
        ('顧客B', '大阪', 1),
        ('顧客C', '名古屋', 2)
    ]
    cursor.executemany('INSERT INTO 顧客 (名前, 住所, 営業マンID) VALUES (?, ?, ?)', 顧客データ)

    # コミットして接続を閉じる
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
