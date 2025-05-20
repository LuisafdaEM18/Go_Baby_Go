import mysql.connector
from db_config import DB_CONFIG


class Database:
    def __init__(self) -> None:
        self.conn = None

    def connect(self):
        self.conn = mysql.connector.connect(**DB_CONFIG)

    def get_connection(self):
        if not self.conn or not self.conn.is_connected():
            self.connect()
        return self.conn

    def close(self):
        if self.conn and self.conn.is_connected():
                self.conn.close()
