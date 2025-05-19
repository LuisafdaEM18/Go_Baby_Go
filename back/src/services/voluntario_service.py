from sqlalchemy.orm import Session
from src.modules.Voluntario import Voluntario
from src.schemas.VoluntarioSchema import VoluntarioBase

def registrar_voluntario(db: Session, voluntario_data: VoluntarioBase):
    validar_voluntario_unico(db, voluntario_data.correo, voluntario_data.identificacion)

    voluntario = Voluntario(
        nombre=voluntario_data.nombre,
        apellido=voluntario_data.apellido,
        identificacion=voluntario_data.identificacion,
        correo=voluntario_data.correo
    )
    db.add(voluntario)
    db.commit()
    db.refresh(voluntario)
    return voluntario



def validar_voluntario_unico(db: Session, correo: str, identificacion: str):
    if db.query(Voluntario).filter_by(correo=correo).first():
        raise ValueError("Ya existe un voluntario con ese correo")
    if db.query(Voluntario).filter_by(identificacion=identificacion).first():
        raise ValueError("Ya existe un voluntario con esa identificación")