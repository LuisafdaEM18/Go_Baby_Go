from sqlalchemy.orm import Session
from src.modules.Voluntario import Voluntario
from src.schemas.VoluntarioSchema import VoluntarioBase

def registrar_voluntario(db: Session, voluntario_data: VoluntarioBase):
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