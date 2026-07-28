import os


class Config:

    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "NEET_TEST_PORTAL_SECRET"
    )

    DEBUG = False

    TESTING = False

    DATABASE = "database/database.db"

    BATCHES_DB = "database/batches.db"

    USERS_DB = "database/users.db"

    SITE_NAME = "NEET Test Portal"

    SITE_URL = "http://127.0.0.1:5000"

    UPLOAD_FOLDER = "uploads"

    THUMBNAIL_FOLDER = "uploads/thumbnails"

    BANNER_FOLDER = "uploads/banners"

    LOGO_FOLDER = "uploads/logos"

    MAX_CONTENT_LENGTH = 100 * 1024 * 1024

    JWT_SECRET = os.environ.get(
        "JWT_SECRET",
        "JWT_SECRET_KEY"
    )

    JWT_EXPIRE = 30
