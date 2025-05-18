from sqlalchemy.orm import Session
from src.modules.Evento import Evento
from src.modules.Formulario import Formulario
from src.schemas.EventoSchema import EventoBase

def crear_evento(db: Session, evento_data: EventoBase, formulario_pre_id: int, formulario_post_id: int):
    formulario_pre = db.query(Formulario).filter(Formulario.id == formulario_pre_id).first()
    formulario_post = db.query(Formulario).filter(Formulario.id == formulario_post_id).first()

    if not formulario_pre or not formulario_post:
        raise ValueError("Formulario pre o post evento no encontrado")

    evento = Evento(
        nombre=evento_data.nombre,
        fecha=evento_data.fecha,
        hora=evento_data.hora,
        lugar=evento_data.lugar,
        descripcion=evento_data.descripcion,
        formulario_preevento_id=formulario_pre.id,
        formulario_postevento_id=formulario_post.id
    )

    db.add(evento)
    db.commit()
    db.refresh(evento)
    return evento



def modificar_evento(db: Session, evento_id: int, evento_data: EventoBase, formulario_pre_id: int, formulario_post_id: int):
    evento = db.query(Evento).filter(Evento.id == evento_id).first()
    if not evento:
        raise ValueError("Evento no encontrado")

    formulario_pre = db.query(Formulario).filter(Formulario.id == formulario_pre_id).first()
    formulario_post = db.query(Formulario).filter(Formulario.id == formulario_post_id).first()
    if not formulario_pre or not formulario_post:
        raise ValueError("Formulario pre o post evento no encontrado")

    evento.nombre = evento_data.nombre
    evento.fecha = evento_data.fecha
    evento.hora = evento_data.hora
    evento.lugar = evento_data.lugar
    evento.descripcion = evento_data.descripcion
    evento.formulario_preevento_id = formulario_pre.id
    evento.formulario_postevento_id = formulario_post.id

    db.commit()
    db.refresh(evento)
    return evento