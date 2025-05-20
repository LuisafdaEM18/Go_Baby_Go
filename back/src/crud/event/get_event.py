from src.db.db_connection import Database


def get_all_events():
    conn = Database().get_connection()
    if not conn:
        raise ValueError
    cursor = conn.cursor()
    sql = f"SELECT id, nombre FROM eventos"
    cursor.execute(sql)
    result = cursor.fetchone()
    cursor.close()
    return result
