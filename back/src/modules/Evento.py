from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from src.db.db import Base

class Evento(Base):
    __tablename__ = 'eventos'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    fecha = Column(Date, nullable=False)
    hora = Column(String(10), nullable=False)
    lugar = Column(String(200), nullable=False)
    descripcion = Column(String(500), nullable=True)

    formulario_preevento_id = Column(Integer, ForeignKey('formularios.id'))
    formulario_postevento_id = Column(Integer, ForeignKey('formularios.id'))

    formulario_preevento = relationship("Formulario", foreign_keys=[formulario_preevento_id], backref="eventos_preevento")
    formulario_postevento = relationship("Formulario", foreign_keys=[formulario_postevento_id], backref="eventos_postevento")