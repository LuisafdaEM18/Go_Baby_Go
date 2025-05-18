from sqlalchemy import Column, Integer, String
from src.db.db import Base

class Administrador(Base):
    __tablename__ = 'administradores'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    contrasena = Column(String(255), nullable=False)