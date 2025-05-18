class Notificacion:
    def __init__(self, titulo: str, destinatario: str, asunto: str, descripcion: str):
        self.titulo: str = titulo
        self.destinatario: str = destinatario
        self.asunto: str = asunto
        self.descripcion: str = descripcion