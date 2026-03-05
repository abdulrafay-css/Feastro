from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import re
import hashlib
import secrets


def generate_random_string(length: int = 32) -> str:
    """
    Generate a random string
    """
    return secrets.token_urlsafe(length)


def generate_hash(data: str) -> str:
    """
    Generate SHA256 hash of data
    """
    return hashlib.sha256(data.encode()).hexdigest()


def is_valid_email(email: str) -> bool:
    """
    Validate email format
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def is_valid_username(username: str) -> bool:
    """
    Validate username format (alphanumeric and underscores only)
    """
    pattern = r'^[a-zA-Z0-9_]{3,50}$'
    return re.match(pattern, username) is not None


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename for safe storage
    """
    # Remove any non-alphanumeric characters except dots and hyphens
    sanitized = re.sub(r'[^\w\s\-\.]', '', filename)
    # Replace spaces with underscores
    sanitized = re.sub(r'\s+', '_', sanitized)
    # Remove leading/trailing dots and spaces
    sanitized = sanitized.strip('. ')
    
    return sanitized


def calculate_pagination(total: int, page: int, page_size: int) -> Dict[str, Any]:
    """
    Calculate pagination metadata
    """
    total_pages = (total + page_size - 1) // page_size
    
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }


def format_duration(seconds: float) -> str:
    """
    Format duration in seconds to human-readable string
    """
    if seconds < 60:
        return f"{int(seconds)}s"
    elif seconds < 3600:
        minutes = int(seconds / 60)
        secs = int(seconds % 60)
        return f"{minutes}m {secs}s"
    else:
        hours = int(seconds / 3600)
        minutes = int((seconds % 3600) / 60)
        return f"{hours}h {minutes}m"


def time_ago(dt: datetime) -> str:
    """
    Convert datetime to "time ago" string
    """
    now = datetime.utcnow()
    diff = now - dt
    
    if diff.days > 365:
        years = diff.days // 365
        return f"{years} year{'s' if years > 1 else ''} ago"
    elif diff.days > 30:
        months = diff.days // 30
        return f"{months} month{'s' if months > 1 else ''} ago"
    elif diff.days > 0:
        return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    else:
        return "just now"


def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """
    Truncate text to maximum length
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix


def parse_tags(tags_string: str) -> list:
    """
    Parse comma-separated tags string into list
    """
    if not tags_string:
        return []
    
    tags = [tag.strip().lower() for tag in tags_string.split(',')]
    # Remove duplicates and empty strings
    return list(filter(None, list(dict.fromkeys(tags))))


def format_file_size(size_bytes: int) -> str:
    """
    Format file size in bytes to human-readable string
    """
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} PB"