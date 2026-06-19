import re


def normalize_phone(value: str) -> str:
    digits = re.sub(r'\D', '', value)
    if digits.startswith('998') and len(digits) == 12:
        return f'+{digits}'
    if digits.startswith('8') and len(digits) == 11:
        return f'+7{digits[1:]}'
    if len(digits) == 9:
        return f'+998{digits}'
    return f'+{digits}'
