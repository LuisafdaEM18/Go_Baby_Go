from sqlalchemy.orm import Session
from src.db.database import Voluntario, InscripcionEvento, Respuesta, DetalleRespuesta, Pregunta, Opcion
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

def get_inscripciones_detalladas_by_evento(db: Session, evento_id: int, skip: int = 0, limit: int = 100):
    # Obtener inscripciones con voluntarios
    inscripciones = db.query(InscripcionEvento).filter(
        InscripcionEvento.evento_id == evento_id
    ).offset(skip).limit(limit).all()
    
    result = []
    for inscripcion in inscripciones:
        # Construir datos básicos de la inscripción
        inscripcion_data = {
            "id": inscripcion.id,
            "voluntario_id": inscripcion.voluntario_id,
            "evento_id": inscripcion.evento_id,
            "fecha_inscripcion": inscripcion.fecha_inscripcion.isoformat(),
            "aceptado": inscripcion.aceptado,
            "completado_pre": inscripcion.completado_pre,
            "completado_post": inscripcion.completado_post,
            "aceptacion_terminos": inscripcion.aceptacion_terminos,
            "voluntario": {
                "id": inscripcion.voluntario.id,
                "nombre": inscripcion.voluntario.nombre,
                "correo": inscripcion.voluntario.correo,
                "numero_identificacion": inscripcion.voluntario.numero_identificacion
            }
        }
        
        # Obtener respuestas pre-evento
        respuestas_pre = []
        respuestas = db.query(Respuesta).filter(
            Respuesta.inscripcion_id == inscripcion.id,
            Respuesta.tipo_formulario == "pre"
        ).all()
        
        for respuesta in respuestas:
            for detalle in respuesta.detalles:
                # Obtener información de la pregunta
                pregunta = db.query(Pregunta).filter(Pregunta.id == detalle.pregunta_id).first()
                if pregunta:
                    respuesta_item = {
                        "pregunta_id": pregunta.id,
                        "pregunta_texto": pregunta.texto,
                        "tipo_pregunta": pregunta.tipo
                    }
                    
                    if pregunta.tipo == "textual":
                        respuesta_item["respuesta_texto"] = detalle.texto_respuesta
                    else:
                        # Para selección única o múltiple, obtener texto de la opción
                        if detalle.opcion_id:
                            opcion = db.query(Opcion).filter(Opcion.id == detalle.opcion_id).first()
                            if opcion:
                                if "opciones_seleccionadas" not in respuesta_item:
                                    respuesta_item["opciones_seleccionadas"] = []
                                respuesta_item["opciones_seleccionadas"].append(opcion.texto_opcion)
                    
                    # Evitar duplicados para la misma pregunta
                    pregunta_existente = None
                    for r in respuestas_pre:
                        if r["pregunta_id"] == pregunta.id:
                            pregunta_existente = r
                            break
                    
                    if pregunta_existente:
                        # Si ya existe y es selección múltiple, agregar la opción
                        if pregunta.tipo == "seleccion_multiple" and detalle.opcion_id:
                            opcion = db.query(Opcion).filter(Opcion.id == detalle.opcion_id).first()
                            if opcion and opcion.texto_opcion not in pregunta_existente.get("opciones_seleccionadas", []):
                                pregunta_existente["opciones_seleccionadas"].append(opcion.texto_opcion)
                    else:
                        respuestas_pre.append(respuesta_item)
        
        inscripcion_data["respuestas_pre"] = respuestas_pre
        result.append(inscripcion_data)
    
    return result

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