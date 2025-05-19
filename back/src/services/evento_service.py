from sqlalchemy.orm import Session
from src.modules.Evento import Evento
from src.schemas.EventoSchema import EventoBase, EventoCreate
from datetime import date

def crear_evento(db: Session, evento_data: EventoCreate):
    validar_datos_evento(db, evento_data, evento_data.formulario_pre_id, evento_data.formulario_post_id)

    evento = Evento(
        nombre=evento_data.nombre,
        fecha=evento_data.fecha,
        hora=evento_data.hora,
        lugar=evento_data.lugar,
        descripcion=evento_data.descripcion,
        formulario_pre_id=evento_data.formulario_pre_id,
        formulario_post_id=evento_data.formulario_post_id
    )
    db.add(evento)
    db.commit()
    db.refresh(evento)
    return evento


def modificar_evento(db: Session, evento_id: int, evento_data: EventoCreate):
    evento = db.query(Evento).filter(Evento.id == evento_id).first()
    if not evento:
        raise ValueError("Evento no encontrado")
    
    validar_datos_evento(db, evento_data, evento_data.formulario_pre_id, evento_data.formulario_post_id, evento_id)

    evento.nombre = evento_data.nombre
    evento.fecha = evento_data.fecha
    evento.hora = evento_data.hora
    evento.lugar = evento_data.lugar
    evento.descripcion = evento_data.descripcion
    evento.formulario_pre_id = evento_data.formulario_pre_id
    evento.formulario_post_id = evento_data.formulario_post_id
    db.commit()
    return evento



def validar_datos_evento(db: Session, evento_data: EventoBase, formulario_pre_id: int, formulario_post_id: int, evento_id: int = None):
    from src.modules.Evento import Evento
    if formulario_pre_id == formulario_post_id:
        raise ValueError("Formulario pre-evento y post-evento no pueden ser el mismo")
    if evento_data.fecha < date.today():
        raise ValueError("La fecha del evento no puede estar en el pasado")

    query = db.query(Evento).filter_by(nombre=evento_data.nombre)
    if evento_id:
        query = query.filter(Evento.id != evento_id)
    if query.first():
        raise ValueError("Ya existe un evento con ese nombre")
