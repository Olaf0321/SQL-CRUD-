import sqlite3

def get_db_connection():
    conn = sqlite3.connect('./data/database.db')
    # conn = sqlite3.connect('./data/my_database.db')
    conn.row_factory = sqlite3.Row
    return conn
