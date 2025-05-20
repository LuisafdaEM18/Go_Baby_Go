from src.db.db_connection import Database
from datetime import date


def update_event(record_id: int, name: str, date: date, state: str):
    conn = Database().get_connection()
    if not conn:
        raise ValueError
    cursor = conn.cursor()
    sql = f"UPDATE eventos SET nombre={name}, fecha_evento={date}, description={state} WHERE id = {record_id}"
    cursor.execute(sql)
