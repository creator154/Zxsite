import uuid
import secrets
from datetime import datetime


def generate_id():
    return uuid.uuid4().hex


def generate_token(length=32):
    return secrets.token_hex(length)


def current_time():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def success(message, data=None):
    return {
        "status": True,
        "message": message,
        "data": data
    }


def error(message):
    return {
        "status": False,
        "message": message
    }
