## Estructura del Proyecto

- `back/`: Backend en FastAPI
- `front/`: Frontend en React + Vite + TypeScript + Tailwind
- `docker-compose.yml`: Orquestador principal (MariaDB + Backend + Frontend)

## Requisitos Previos

- **Docker y Docker Desktop** instalado y en ejecución en tu sistema.
- **Git** para clonar el repositorio.

---

## Clonar el repositorio

```bash
git clone 'enlace_al_repositorio'
cd Go_Baby_Go
```

---

## 🐳 Inicio Rápido (Recomendado: Usando Docker)

Como el proyecto se encuentra **100% dockerizado**, no necesitas instalar Python ni Node.js en tu equipo. Solamente abre tu consola en la carpeta raíz (`Go_Baby_Go`) y ejecuta:

```bash
docker-compose up -d --build
```

Esto descargará las imágenes, creará la base de datos automáticamente e iniciará todos los servicios. Puedes acceder a ellos en las siguientes direcciones:

- **Frontend (Aplicación web):** [http://localhost:5173](http://localhost:5173)
- **Backend (API):** [http://localhost:8001](http://localhost:8001)
- **Swagger UI (Documentación API):** [http://localhost:8001/docs](http://localhost:8001/docs)
- **Base de Datos MariaDB:** Puerto `3307` (Credenciales: root / rootpassword)

### Credenciales de Administrador (Por defecto)
- **Correo:** `admin@gobabygofundacion.org`
- **Contraseña:** `admin123`

Para apagar el proyecto cuando termines de trabajar:
```bash
docker-compose down
```

---

## 🛠 Instalación Manual (Sin Docker)

Si deseas trabajar estrictamente en desarrollo manual componente por componente:

### 1. Base de datos
Debes tener MariaDB/MySQL localmente e importar el archivo `back/schema.sql`. (Deberás configurar la variable de entorno `DATABASE_URL` manualmente).

### 2. Frontend
Acceder a la carpeta `front` e instalar/ejecutar:
```bash
cd front
npm install
npm run dev
```

### 3. Backend (En otra consola)
Acceder a la carpeta `back` y configurar el entorno:

**En Windows:**
```bash
cd back
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requierements.txt
uvicorn src.main:app --reload --port 8001
```

**En macOS/Linux:**
```bash
cd back
python3 -m venv .venv
source .venv/bin/activate
pip install -r requierements.txt
uvicorn src.main:app --reload --port 8001
```

Prueba Actions
