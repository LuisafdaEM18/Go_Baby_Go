from sqlalchemy import Column, Integer, String
from src.db.db import Base

class Voluntario(Base):
    __tablename__ = 'voluntarios'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    identificacion = Column(String(50), unique=True, nullable=False)
    correo = Column(String(100), unique=True, nullable=False)