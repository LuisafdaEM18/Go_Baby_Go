from sqlalchemy.orm import Session
from src.modules.Formulario import Formulario
from src.modules.Pregunta import Pregunta
from src.schemas.FormularioSchema import FormularioCreate

def crear_formulario(db: Session, formulario_data: FormularioCreate):
    nuevo_formulario = Formulario(nombre=formulario_data.nombre, descripcion=formulario_data.descripcion)
    db.add(nuevo_formulario)
    db.commit()
    db.refresh(nuevo_formulario)

    for pregunta_data in formulario_data.preguntas:
        nueva_pregunta = Pregunta(
            titulo=pregunta_data.titulo,
            descripcion=pregunta_data.descripcion,
            formulario_id=nuevo_formulario.id
        )
        db.add(nueva_pregunta)
    db.commit()
    return nuevo_formulario


def modificar_formulario(db: Session, formulario_id: int, formulario_data: FormularioCreate):
    formulario = db.query(Formulario).filter(Formulario.id == formulario_id).first()
    if not formulario:
        raise ValueError("Formulario no encontrado")

    formulario.nombre = formulario_data.nombre
    formulario.descripcion = formulario_data.descripcion

    db.query(Pregunta).filter(Pregunta.formulario_id == formulario_id).delete()
    for pregunta_data in formulario_data.preguntas:
        nueva_pregunta = Pregunta(
            titulo=pregunta_data.titulo,
            descripcion=pregunta_data.descripcion,
            formulario_id=formulario.id
        )
        db.add(nueva_pregunta)
    db.commit()
    return formulario


def eliminar_formulario(db: Session, formulario_id: int):
    formulario = db.query(Formulario).filter(Formulario.id == formulario_id).first()
    if not formulario:
        raise ValueError("Formulario no encontrado")
    db.delete(formulario)
    db.commit()
    return True