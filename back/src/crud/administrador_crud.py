from sqlalchemy.orm import Session
from src.db.database import Administrador
from src.schemas.AdministradorSchema import AdministradorCreate
from passlib.context import CryptContext
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_administrador(db: Session, administrador_id: int):
    return db.query(Administrador).filter(Administrador.id == administrador_id).first()

def get_administrador_by_email(db: Session, email: str):
    return db.query(Administrador).filter(Administrador.correo == email).first()

def get_administradores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Administrador).offset(skip).limit(limit).all()

def create_administrador(db: Session, administrador: AdministradorCreate):
    hashed_password = get_password_hash(administrador.contrasena)
    db_administrador = Administrador(
        nombre=administrador.nombre,
        correo=administrador.correo,
        contrasena_hash=hashed_password
    )
    db.add(db_administrador)
    db.commit()
    db.refresh(db_administrador)
    return db_administrador

def authenticate_administrador(db: Session, email: str, password: str):
    administrador = get_administrador_by_email(db, email)
    if not administrador:
        return False
    if not verify_password(password, administrador.contrasena_hash):
        return False
    return administrador 