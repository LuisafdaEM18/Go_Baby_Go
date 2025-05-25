from sqlalchemy.orm import Session
from src.db.database import Voluntario, InscripcionEvento, Respuesta, DetalleRespuesta
from src.schemas.VoluntarioSchema import VoluntarioCreate, VoluntarioInscripcion
from typing import List, Optional, Dict, Any
import uuid

def get_voluntario(db: Session, voluntario_id: int):
    return db.query(Voluntario).filter(Voluntario.id == voluntario_id).first()

def get_voluntario_by_email(db: Session, email: str):
    return db.query(Voluntario).filter(Voluntario.correo == email).first()

def get_voluntarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Voluntario).offset(skip).limit(limit).all()

def create_voluntario(db: Session, voluntario: VoluntarioCreate):
    db_voluntario = Voluntario(
        nombre=voluntario.nombre,
        correo=voluntario.correo,
        confirmacion_correo=voluntario.confirmacion_correo,
        numero_identificacion=voluntario.numero_identificacion
    )
    db.add(db_voluntario)
    db.commit()
    db.refresh(db_voluntario)
    return db_voluntario

def inscribir_voluntario(db: Session, inscripcion: VoluntarioInscripcion):
    # Verificar si el voluntario ya existe
    db_voluntario = get_voluntario_by_email(db, inscripcion.correo)
    
    # Si no existe, crearlo
    if not db_voluntario:
        db_voluntario = Voluntario(
            nombre=inscripcion.nombre,
            correo=inscripcion.correo,
            confirmacion_correo=inscripcion.confirmacion_correo,
            numero_identificacion=inscripcion.numero_identificacion
        )
        db.add(db_voluntario)
        db.flush()
    
    # Verificar si ya está inscrito en este evento
    existing_inscripcion = db.query(InscripcionEvento).filter(
        InscripcionEvento.voluntario_id == db_voluntario.id,
        InscripcionEvento.evento_id == inscripcion.evento_id
    ).first()
    
    if existing_inscripcion:
        return {"message": "Ya está inscrito en este evento"}, 400
    
    # Crear inscripción
    db_inscripcion = InscripcionEvento(
        voluntario_id=db_voluntario.id,
        evento_id=inscripcion.evento_id,
        aceptacion_terminos=inscripcion.aceptacion_terminos
    )
    db.add(db_inscripcion)
    db.commit()
    db.refresh(db_inscripcion)
    
    return db_inscripcion

def get_inscripciones_by_evento(db: Session, evento_id: int, skip: int = 0, limit: int = 100):
    return db.query(InscripcionEvento).filter(
        InscripcionEvento.evento_id == evento_id
    ).offset(skip).limit(limit).all()

def actualizar_estado_inscripcion(db: Session, inscripcion_id: int, aceptado: bool):
    db_inscripcion = db.query(InscripcionEvento).filter(InscripcionEvento.id == inscripcion_id).first()
    if not db_inscripcion:
        return None
    
    db_inscripcion.aceptado = aceptado
    db.commit()
    db.refresh(db_inscripcion)
    return db_inscripcion

def guardar_respuestas_formulario(db: Session, inscripcion_id: int, tipo_formulario: str, respuestas: Dict[str, Any]):
    db_inscripcion = db.query(InscripcionEvento).filter(InscripcionEvento.id == inscripcion_id).first()
    if not db_inscripcion:
        return None
    
    # Crear código único para la respuesta
    codigo_respuesta = str(uuid.uuid4())[:8]
    
    # Crear registro de respuesta
    db_respuesta = Respuesta(
        inscripcion_id=inscripcion_id,
        tipo_formulario=tipo_formulario,
        codigo_respuesta=codigo_respuesta
    )
    db.add(db_respuesta)
    db.flush()
    
    # Guardar detalles de respuestas
    for pregunta_id, respuesta in respuestas.items():
        if isinstance(respuesta, list):  # Selección múltiple
            for opcion_id in respuesta:
                db_detalle = DetalleRespuesta(
                    respuesta_id=db_respuesta.id,
                    pregunta_id=int(pregunta_id),
                    opcion_id=int(opcion_id)
                )
                db.add(db_detalle)
        elif isinstance(respuesta, dict) and "opcion_id" in respuesta:  # Selección única
            db_detalle = DetalleRespuesta(
                respuesta_id=db_respuesta.id,
                pregunta_id=int(pregunta_id),
                opcion_id=int(respuesta["opcion_id"])
            )
            db.add(db_detalle)
        else:  # Respuesta textual
            db_detalle = DetalleRespuesta(
                respuesta_id=db_respuesta.id,
                pregunta_id=int(pregunta_id),
                texto_respuesta=str(respuesta)
            )
            db.add(db_detalle)
    
    # Actualizar estado de la inscripción
    if tipo_formulario == "pre":
        db_inscripcion.completado_pre = True
    else:
        db_inscripcion.completado_post = True
    
    db.commit()
    return {"codigo_respuesta": codigo_respuesta} 