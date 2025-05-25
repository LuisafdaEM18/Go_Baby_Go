from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, Enum, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
import os
from datetime import datetime

# Use SQLite for testing
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./go_baby_go.db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Administrador(Base):
    __tablename__ = "administradores"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    correo = Column(String(255), nullable=False, unique=True)
    contrasena_hash = Column(String(255), nullable=False)

class Formulario(Base):
    __tablename__ = "formularios"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.now)
    
    # Relationships
    preguntas = relationship("Pregunta", back_populates="formulario", cascade="all, delete-orphan")
    eventos_pre = relationship("Evento", foreign_keys="Evento.formulario_pre_evento", back_populates="formulario_pre")
    eventos_post = relationship("Evento", foreign_keys="Evento.formulario_post_evento", back_populates="formulario_post")

class Pregunta(Base):
    __tablename__ = "preguntas"
    
    id = Column(Integer, primary_key=True, index=True)
    formulario_id = Column(Integer, ForeignKey("formularios.id"), nullable=False)
    texto = Column(Text, nullable=False)
    tipo = Column(Enum("textual", "seleccion_multiple", "seleccion_unica"), nullable=False)
    
    # Relationships
    formulario = relationship("Formulario", back_populates="preguntas")
    opciones = relationship("Opcion", back_populates="pregunta", cascade="all, delete-orphan")
    detalles_respuestas = relationship("DetalleRespuesta", back_populates="pregunta")

class Opcion(Base):
    __tablename__ = "opciones"
    
    id = Column(Integer, primary_key=True, index=True)
    pregunta_id = Column(Integer, ForeignKey("preguntas.id"), nullable=False)
    texto_opcion = Column(String(255), nullable=False)
    
    # Relationships
    pregunta = relationship("Pregunta", back_populates="opciones")
    detalles_respuestas = relationship("DetalleRespuesta", back_populates="opcion")

class Evento(Base):
    __tablename__ = "eventos"
    
    id = Column(Integer, primary_key=True, index=True)
    id_general = Column(String(100))
    nombre = Column(String(255))
    fecha_evento = Column(Date)
    lugar = Column(String(255))
    descripcion = Column(Text)
    formulario_pre_evento = Column(Integer, ForeignKey("formularios.id"))
    formulario_post_evento = Column(Integer, ForeignKey("formularios.id"))
    
    # Relationships
    formulario_pre = relationship("Formulario", foreign_keys=[formulario_pre_evento], back_populates="eventos_pre")
    formulario_post = relationship("Formulario", foreign_keys=[formulario_post_evento], back_populates="eventos_post")
    inscripciones = relationship("InscripcionEvento", back_populates="evento")

class Voluntario(Base):
    __tablename__ = "voluntarios"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    correo = Column(String(255), nullable=False)
    confirmacion_correo = Column(String(255), nullable=False)
    numero_identificacion = Column(String(100), nullable=False)
    
    # Relationships
    inscripciones = relationship("InscripcionEvento", back_populates="voluntario")

class InscripcionEvento(Base):
    __tablename__ = "inscripciones_eventos"
    
    id = Column(Integer, primary_key=True, index=True)
    voluntario_id = Column(Integer, ForeignKey("voluntarios.id"), nullable=False)
    evento_id = Column(Integer, ForeignKey("eventos.id"), nullable=False)
    fecha_inscripcion = Column(DateTime, default=datetime.now)
    aceptado = Column(Boolean, default=False)
    completado_pre = Column(Boolean, default=False)
    completado_post = Column(Boolean, default=False)
    aceptacion_terminos = Column(Boolean, default=False)
    
    # Relationships
    voluntario = relationship("Voluntario", back_populates="inscripciones")
    evento = relationship("Evento", back_populates="inscripciones")
    respuestas = relationship("Respuesta", back_populates="inscripcion")

class Respuesta(Base):
    __tablename__ = "respuestas"
    
    id = Column(Integer, primary_key=True, index=True)
    inscripcion_id = Column(Integer, ForeignKey("inscripciones_eventos.id"), nullable=False)
    fecha_respuesta = Column(DateTime, default=datetime.now)
    tipo_formulario = Column(Enum("pre", "post"), nullable=False)
    codigo_respuesta = Column(String(25))
    
    # Relationships
    inscripcion = relationship("InscripcionEvento", back_populates="respuestas")
    detalles = relationship("DetalleRespuesta", back_populates="respuesta", cascade="all, delete-orphan")

class DetalleRespuesta(Base):
    __tablename__ = "detalle_respuestas"
    
    id = Column(Integer, primary_key=True, index=True)
    respuesta_id = Column(Integer, ForeignKey("respuestas.id"), nullable=False)
    pregunta_id = Column(Integer, ForeignKey("preguntas.id"), nullable=False)
    texto_respuesta = Column(Text)
    opcion_id = Column(Integer, ForeignKey("opciones.id"))
    
    # Relationships
    respuesta = relationship("Respuesta", back_populates="detalles")
    pregunta = relationship("Pregunta", back_populates="detalles_respuestas")
    opcion = relationship("Opcion", back_populates="detalles_respuestas")

class TerminosCondiciones(Base):
    __tablename__ = "terminos_y_condiciones"
    
    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(50))
    texto = Column(Text)
    fecha_creacion = Column(DateTime, default=datetime.now) 