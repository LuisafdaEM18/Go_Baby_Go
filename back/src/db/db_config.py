import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración para conexión a la base de datos
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "go_baby_go"),
}
