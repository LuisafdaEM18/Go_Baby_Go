from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.db.db import Base

class Pregunta(Base):
    __tablename__ = 'preguntas'

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    descripcion = Column(String(500), nullable=True)

    formulario_id = Column(Integer, ForeignKey('formularios.id'))
    formulario = relationship("Formulario", back_populates="preguntas")