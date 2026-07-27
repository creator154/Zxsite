import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATABASE_DB = os.path.join(BASE_DIR, "database.db")
BATCHES_DB = os.path.join(BASE_DIR, "batches.db")
USERS_DB = os.path.join(BASE_DIR, "users.db")


# =========================
# Main Database
# =========================

conn = sqlite3.connect(DATABASE_DB)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS settings(
id INTEGER PRIMARY KEY AUTOINCREMENT,
site_name TEXT,
site_logo TEXT,
theme TEXT,
maintenance INTEGER DEFAULT 0
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS announcements(
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT,
message TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
conn.close()


# =========================
# Batches Database
# =========================

conn = sqlite3.connect(BATCHES_DB)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS batches(
id INTEGER PRIMARY KEY AUTOINCREMENT,
batch_id TEXT UNIQUE,
name TEXT,
category TEXT,
language TEXT,
description TEXT,
thumbnail TEXT,
banner TEXT,
status INTEGER DEFAULT 1
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS subjects(
id INTEGER PRIMARY KEY AUTOINCREMENT,
subject_id TEXT,
batch_id TEXT,
name TEXT,
icon TEXT
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS tests(
id INTEGER PRIMARY KEY AUTOINCREMENT,
test_id TEXT UNIQUE,
batch_id TEXT,
subject_id TEXT,
title TEXT,
type TEXT,
questions INTEGER,
duration INTEGER,
marks INTEGER,
url TEXT,
thumbnail TEXT,
status INTEGER DEFAULT 1
)
""")

conn.commit()
conn.close()


# =========================
# Users Database
# =========================

conn = sqlite3.connect(USERS_DB)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password TEXT,
role TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS sessions(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
token TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
conn.close()

print("✅ All databases created successfully.")
