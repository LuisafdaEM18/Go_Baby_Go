#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.db.database import SessionLocal, Administrador, Base, engine
from src.crud.administrador_crud import get_password_hash, verify_password, authenticate_administrador
import sqlite3

def check_database():
    """Check the database structure and admin user"""
    print("=== Diagnóstico de Autenticación ===\n")
    
    # Check database file exists
    db_path = "./go_baby_go.db"
    if os.path.exists(db_path):
        print(f"✓ Base de datos encontrada: {db_path}")
    else:
        print(f"✗ Base de datos NO encontrada: {db_path}")
        return
    
    # Connect using sqlite3 directly
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if administradores table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='administradores';")
        table_exists = cursor.fetchone()
        
        if table_exists:
            print("✓ Tabla 'administradores' existe")
            
            # Get all administrators
            cursor.execute("SELECT id, nombre, correo, contrasena_hash FROM administradores;")
            admins = cursor.fetchall()
            
            print(f"📊 Administradores en la base de datos: {len(admins)}")
            for admin in admins:
                print(f"  - ID: {admin[0]}, Nombre: {admin[1]}, Correo: {admin[2]}")
                print(f"    Hash: {admin[3][:20]}..." if admin[3] else "    Hash: NULL")
        else:
            print("✗ Tabla 'administradores' NO existe")
        
        conn.close()
        
    except Exception as e:
        print(f"✗ Error accediendo a la base de datos: {e}")
    
    # Test SQLAlchemy connection
    print("\n=== Test SQLAlchemy ===")
    try:
        db = SessionLocal()
        
        # Test query
        admin = db.query(Administrador).filter(Administrador.correo == "admin@gobabygofundacion.org").first()
        
        if admin:
            print("✓ Admin encontrado con SQLAlchemy")
            print(f"  - ID: {admin.id}")
            print(f"  - Nombre: {admin.nombre}")
            print(f"  - Correo: {admin.correo}")
            print(f"  - Hash existe: {'Sí' if admin.contrasena_hash else 'No'}")
            
            # Test password verification
            test_password = "admin123"
            is_valid = verify_password(test_password, admin.contrasena_hash)
            print(f"  - Contraseña 'admin123' válida: {'Sí' if is_valid else 'No'}")
            
            # Test authentication function
            auth_result = authenticate_administrador(db, "admin@gobabygofundacion.org", "admin123")
            print(f"  - Función de autenticación: {'✓ Exitosa' if auth_result else '✗ Falló'}")
            
        else:
            print("✗ Admin NO encontrado con SQLAlchemy")
            
        db.close()
        
    except Exception as e:
        print(f"✗ Error con SQLAlchemy: {e}")

def recreate_admin():
    """Recreate admin user if needed"""
    print("\n=== Recrear Administrador ===")
    
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("✓ Tablas creadas/verificadas")
        
        db = SessionLocal()
        
        # Delete existing admin
        existing_admin = db.query(Administrador).filter(Administrador.correo == "admin@gobabygofundacion.org").first()
        if existing_admin:
            db.delete(existing_admin)
            db.commit()
            print("🗑️ Admin existente eliminado")
        
        # Create new admin
        hashed_password = get_password_hash("admin123")
        new_admin = Administrador(
            nombre="Admin",
            correo="admin@gobabygofundacion.org",
            contrasena_hash=hashed_password
        )
        
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        
        print("✓ Nuevo admin creado exitosamente")
        print(f"  - ID: {new_admin.id}")
        print(f"  - Email: admin@gobabygofundacion.org")
        print(f"  - Password: admin123")
        
        # Test the new admin
        auth_result = authenticate_administrador(db, "admin@gobabygofundacion.org", "admin123")
        print(f"  - Test de autenticación: {'✓ Exitoso' if auth_result else '✗ Falló'}")
        
        db.close()
        
    except Exception as e:
        print(f"✗ Error recreando admin: {e}")

if __name__ == "__main__":
    check_database()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--recreate":
        recreate_admin()
        print("\n=== Verificación después de recrear ===")
        check_database() 