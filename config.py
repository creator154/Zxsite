import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "NEET_TEST_PORTAL_SECRET"
    )

    JWT_SECRET = os.getenv(
        "JWT_SECRET",
        "JWT_SECRET_KEY"
    )

    DEBUG = os.getenv(
        "DEBUG",
        "False"
    ).lower() == "true"

    HOST = os.getenv(
        "HOST",
        "0.0.0.0"
    )

    PORT = int(
        os.getenv(
            "PORT",
            5000
        )
    )

    DATABASE = os.getenv(
        "DATABASE",
        "database/database.db"
    )

    BATCHES_DB = os.getenv(
        "BATCHES_DB",
        "database/batches.db"
    )

    USERS_DB = os.getenv(
        "USERS_DB",
        "database/users.db"
    )

    UPLOAD_FOLDER = os.getenv(
        "UPLOAD_FOLDER",
        "uploads"
    )

    SITE_NAME = os.getenv(
        "SITE_NAME",
        "NEET Test Portal"
    )

    SITE_URL = os.getenv(
        "SITE_URL",
        "http://127.0.0.1:5000"
    )

    MAX_CONTENT_LENGTH = 500 * 1024 * 1024

    JSON_SORT_KEYS = False
