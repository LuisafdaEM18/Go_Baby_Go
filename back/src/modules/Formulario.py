from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from src.db.db import Base

class Formulario(Base):
    __tablename__ = 'formularios'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(500), nullable=True)

    preguntas = relationship("Pregunta", back_populates="formulario", cascade="all, delete-orphan")