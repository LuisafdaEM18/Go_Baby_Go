## Estructura del Proyecto

- `back/`: Backend en FastAPI
- `front/`: Frontend en React + Vite + TypeScript + Tailwind

## Requisitos

- Python 3.8+
- Node.js 16+
- MariaDB o MySQL


## Clonar el repositorio
-   ```bash
    git clone 'enlace_al_repositorio'
    ```

### Para descargar las dependencias del Front:
- Acceder a la carpeta de front y una vez dentro ejecutar el siguiente comando
-   ```bash
    npm install && npm run dev
    ```

### Para descargar las dependencias del Back:
- Acceder a la carpeta de back y una vez dentro ejecutar el siguiente comando:
- #### Crear un entorno virtual en Windows y activarlo
    - ```bash
        python -m venv .venv && .\.venv\Scripts\activate
      ```
- #### Crear un entorno virtual en macOS/Linux y activarlo
    - ```bash
        python3 -m venv .venv && source .venv/bin/activate
      ```

Instalar las dependencias en el entorno virtual y ejecutar el Backend
-   ```bash
    pip install -r requierements.txt && uvicorn src.main:app --reload --port 8001
    ```

