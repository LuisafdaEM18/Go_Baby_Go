import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.db.database import SessionLocal
from src.db.database import Administrador
from src.crud.administrador_crud import get_password_hash, get_administrador_by_email

def create_admin(nombre, correo, contrasena):
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = get_administrador_by_email(db, correo)
        if existing_admin:
            print(f"El administrador con correo {correo} ya existe.")
            return
        
        # Hash the password
        hashed_password = get_password_hash(contrasena)
        
        # Create admin
        db_admin = Administrador(
            nombre=nombre,
            correo=correo,
            contrasena_hash=hashed_password
        )
        
        db.add(db_admin)
        db.commit()
        db.refresh(db_admin)
        
        print(f"Administrador {nombre} creado con éxito.")
        print(f"Email: {correo}")
        print(f"Contraseña: {contrasena}")
        
    except Exception as e:
        print(f"Error al crear administrador: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Default admin credentials
    default_nombre = "Admin"
    default_correo = "admin@gobabygofundacion.org"
    default_contrasena = "admin123"
    
    # Get credentials from command line arguments or use defaults
    if len(sys.argv) > 3:
        nombre = sys.argv[1]
        correo = sys.argv[2]
        contrasena = sys.argv[3]
    else:
        nombre = default_nombre
        correo = default_correo
        contrasena = default_contrasena
        
    create_admin(nombre, correo, contrasena)
    