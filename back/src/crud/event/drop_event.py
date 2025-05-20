from src.db.db_connection import Database


def drop_event(id: int):
    conn = Database().get_connection()
    if not conn:
        raise ValueError
    cursor = conn.cursor()
    sql = f"DROP FROM eventos WHERE id = {id}"
    cursor.execute(sql)
