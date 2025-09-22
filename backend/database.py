import sqlite3
from typing import Optional

try:
    import mysql.connector  # type: ignore
    from mysql.connector import MySQLConnection
except Exception:
    mysql = None  # Fallback if not installed yet
    MySQLConnection = None  # type: ignore


def get_sqlite_connection():
    conn = sqlite3.connect('./data/database.db')
    conn.row_factory = sqlite3.Row
    return conn


def get_mysql_connection(host: str, port: int, user: str, password: str, database: str):
    if 'mysql' not in globals() or mysql is None:
        raise RuntimeError('MySQL driver not installed. Please install mysql-connector-python.')
    conn = mysql.connector.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database,
    )
    return conn


def get_db_connection_from_request_headers(headers) -> Optional[object]:
    """
    Build a DB connection based on request headers.
    Expected headers:
      X-DB-Type: 'mysql' | 'sqlite'
      X-DB-Host, X-DB-Port, X-DB-User, X-DB-Password, X-DB-Name (for mysql)
    Fallback to SQLite if not provided.
    """
    db_type = (headers.get('x-db-type') or headers.get('X-DB-Type') or '').lower()
    if db_type == 'mysql':
        host = headers.get('x-db-host') or headers.get('X-DB-Host') or 'localhost'
        port_str = headers.get('x-db-port') or headers.get('X-DB-Port') or '3306'
        user = headers.get('x-db-user') or headers.get('X-DB-User') or ''
        password = headers.get('x-db-password') or headers.get('X-DB-Password') or ''
        database = headers.get('x-db-name') or headers.get('X-DB-Name') or ''
        port = int(port_str)
        return get_mysql_connection(host, port, user, password, database)
    # default to sqlite
    return get_sqlite_connection()
