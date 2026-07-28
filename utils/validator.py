import re


def is_empty(value):
    return value is None or str(value).strip() == ""


def is_valid_url(url):
    pattern = re.compile(
        r'^(https?|ftp)://[^\s/$.?#].[^\s]*$',
        re.IGNORECASE
    )
    return bool(pattern.match(url))


def is_valid_email(email):
    pattern = re.compile(
        r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    )
    return bool(pattern.match(email))


def is_positive(number):
    try:
        return int(number) > 0
    except:
        return False
