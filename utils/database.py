import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASE_DB = os.path.join(BASE_DIR, "database", "database.db")
BATCHES_DB = os.path.join(BASE_DIR, "database", "batches.db")
USERS_DB = os.path.join(BASE_DIR, "database", "users.db")


def get_database():
    conn = sqlite3.connect(DATABASE_DB)
    conn.row_factory = sqlite3.Row
    return conn


def get_batches():
    conn = sqlite3.connect(BATCHES_DB)
    conn.row_factory = sqlite3.Row
    return conn


def get_users():
    conn = sqlite3.connect(USERS_DB)
    conn.row_factory = sqlite3.Row
    return conn


def close(conn):
    if conn:
        conn.close()
