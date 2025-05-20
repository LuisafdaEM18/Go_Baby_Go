from src.db.db_connection import Database
from datetime import datetime


def create_event(name: str, date: datetime, locate: str):
    conn = Database().get_connection()
    if not conn:
        raise ValueError
    cursor = conn.cursor()
    sql = f"INSERT INTO eventos (nombre, fecha_evento, lugar) VALUES ({name}, {date}, {locate})"
    cursor.execute(sql)
