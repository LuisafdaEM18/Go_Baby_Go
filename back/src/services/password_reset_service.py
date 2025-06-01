import secrets
import smtplib
from datetime import datetime, timedelta
# from email.mime.text import MimeText
# from email.mime.multipart import MimeMultipart
from sqlalchemy.orm import Session
from typing import Optional
import os
import hashlib
import bcrypt

from src.db.database import PasswordResetToken, Administrador
from src.crud import administrador_crud


class PasswordResetService:
    def __init__(self):
        # Configuración de email (usar variables de entorno en producción)
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@gobabygo.com")
        self.app_url = os.getenv("APP_URL", "http://localhost:5173")
        
    def generate_secure_token(self) -> str:
        """Genera un token seguro para recuperación de contraseña"""
        # Combinar timestamp + random bytes para mayor entropía
        timestamp = str(datetime.now().timestamp()).encode()
        random_bytes = secrets.token_bytes(32)
        combined = timestamp + random_bytes
        
        # Usar SHA-256 para crear un hash determinístico pero seguro
        return hashlib.sha256(combined).hexdigest()
    
    def create_reset_token(self, db: Session, admin: Administrador) -> PasswordResetToken:
        """Crea un token de recuperación para un administrador"""
        # Invalidar tokens existentes
        self.invalidate_existing_tokens(db, admin.id)
        
        # Generar nuevo token
        token = self.generate_secure_token()
        expires_at = datetime.now() + timedelta(minutes=30)  # Token expira en 30 minutos
        
        # Crear registro en base de datos
        reset_token = PasswordResetToken(
            admin_id=admin.id,
            token=token,
            expires_at=expires_at,
            used=False
        )
        
        db.add(reset_token)
        db.commit()
        db.refresh(reset_token)
        
        return reset_token
    
    def invalidate_existing_tokens(self, db: Session, admin_id: int):
        """Invalida todos los tokens existentes para un administrador"""
        db.query(PasswordResetToken).filter(
            PasswordResetToken.admin_id == admin_id,
            PasswordResetToken.used == False
        ).update({PasswordResetToken.used: True})
        db.commit()
    
    def validate_token(self, db: Session, token: str) -> Optional[PasswordResetToken]:
        """Valida si un token es válido y no ha expirado"""
        reset_token = db.query(PasswordResetToken).filter(
            PasswordResetToken.token == token,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > datetime.now()
        ).first()
        
        return reset_token
    
    def use_token(self, db: Session, token: str, new_password: str) -> bool:
        """Usa un token para cambiar la contraseña"""
        reset_token = self.validate_token(db, token)
        if not reset_token:
            return False
        
        # Cambiar contraseña del administrador
        admin = db.query(Administrador).filter(Administrador.id == reset_token.admin_id).first()
        if not admin:
            return False
        
        # Hash de la nueva contraseña
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), salt)
        admin.contrasena_hash = hashed_password.decode('utf-8')
        
        # Marcar token como usado
        reset_token.used = True
        
        db.commit()
        return True
    
    def send_reset_email(self, admin: Administrador, token: str) -> bool:
        """Envía el correo con el enlace de recuperación"""
        try:
            # Crear enlace de recuperación
            reset_link = f"{self.app_url}/reset-password?token={token}"
            
            # En desarrollo, solo registrar el enlace en consola
            print(f"🔗 Enlace de recuperación para {admin.correo}: {reset_link}")
            print(f"📧 Correo simulado enviado a: {admin.nombre} ({admin.correo})")
            
            # TODO: Implementar envío real de correo cuando esté en producción
            # Por ahora solo simulamos el envío
            return True
                
        except Exception as e:
            print(f"Error enviando correo de recuperación: {str(e)}")
            return False
    
    def cleanup_expired_tokens(self, db: Session):
        """Limpia tokens expirados de la base de datos"""
        db.query(PasswordResetToken).filter(
            PasswordResetToken.expires_at < datetime.now()
        ).delete()
        db.commit()


# Instancia global del servicio
password_reset_service = PasswordResetService() 