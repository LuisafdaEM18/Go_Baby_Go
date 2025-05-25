from sqlalchemy.orm import Session
from sqlalchemy import func
from src.db.database import Evento, InscripcionEvento
from src.schemas.EventoSchema import EventoCreate, EventoUpdate
from typing import List, Optional

def get_evento(db: Session, evento_id: int):
    return db.query(Evento).filter(Evento.id == evento_id).first()

def get_eventos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Evento).offset(skip).limit(limit).all()

def get_eventos_with_stats(db: Session, skip: int = 0, limit: int = 100):
    eventos = db.query(Evento).offset(skip).limit(limit).all()
    
    result = []
    for evento in eventos:
        total_voluntarios = db.query(func.count(InscripcionEvento.id)).filter(
            InscripcionEvento.evento_id == evento.id
        ).scalar()
        
        voluntarios_aceptados = db.query(func.count(InscripcionEvento.id)).filter(
            InscripcionEvento.evento_id == evento.id,
            InscripcionEvento.aceptado == True
        ).scalar()
        
        evento_dict = {
            "id": evento.id,
            "nombre": evento.nombre,
            "fecha_evento": evento.fecha_evento,
            "lugar": evento.lugar,
            "descripcion": evento.descripcion,
            "formulario_pre": evento.formulario_pre_evento,
            "formulario_post": evento.formulario_post_evento,
            "total_voluntarios": total_voluntarios,
            "voluntarios_aceptados": voluntarios_aceptados
        }
        result.append(evento_dict)
    
    return result

def create_evento(db: Session, evento: EventoCreate):
    db_evento = Evento(
        nombre=evento.nombre,
        fecha_evento=evento.fecha_evento,
        lugar=evento.lugar,
        descripcion=evento.descripcion,
        formulario_pre_evento=evento.formulario_pre_evento,
        formulario_post_evento=evento.formulario_post_evento
    )
    db.add(db_evento)
    db.commit()
    db.refresh(db_evento)
    return db_evento

def update_evento(db: Session, evento_id: int, evento: EventoUpdate):
    db_evento = get_evento(db, evento_id)
    if not db_evento:
        return None
    
    if evento.nombre:
        db_evento.nombre = evento.nombre
    if evento.fecha_evento:
        db_evento.fecha_evento = evento.fecha_evento
    if evento.lugar:
        db_evento.lugar = evento.lugar
    if evento.descripcion:
        db_evento.descripcion = evento.descripcion
    if evento.formulario_pre_evento is not None:
        db_evento.formulario_pre_evento = evento.formulario_pre_evento
    if evento.formulario_post_evento is not None:
        db_evento.formulario_post_evento = evento.formulario_post_evento
    
    db.commit()
    db.refresh(db_evento)
    return db_evento

def delete_evento(db: Session, evento_id: int):
    db_evento = get_evento(db, evento_id)
    if not db_evento:
        return False
    
    db.delete(db_evento)
    db.commit()
    return True 