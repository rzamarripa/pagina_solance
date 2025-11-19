# Solance Residences - Página Web

Proyecto de página web para Solance Residences con API Node.js para envío de correos.

## Estructura del Proyecto

```
pagina_solance/
├── api/                    # API Node.js
│   ├── server.js          # Servidor Express
│   ├── package.json       # Dependencias Node.js
│   ├── Dockerfile         # Imagen Docker para la API
│   └── .gitignore
├── html/                   # Archivos estáticos de la página
│   ├── css/
│   ├── fonts/
│   ├── img/
│   ├── js/
│   ├── index.html
│   └── ...
├── docker-compose.yml      # Configuración Docker
├── nginx.conf             # Configuración Nginx
└── README.md
```

## Requisitos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración SMTP para envío de correos
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion

# Correos
FROM_EMAIL=tu_correo@gmail.com
TO_EMAIL=destino@gmail.com
```

**Nota para Gmail**: Necesitas generar una "Contraseña de aplicación" en tu cuenta de Google:
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos
3. Contraseñas de aplicaciones
4. Genera una nueva contraseña para "Correo"

## Instalación y Uso

### Con Docker (Recomendado)

1. Clona el repositorio
2. Crea el archivo `.env` con tus credenciales
3. Ejecuta:

```bash
docker-compose up -d
```

La aplicación estará disponible en:
- Página web: http://localhost:3007
- API: http://localhost:3000

### Desarrollo Local

1. Instala las dependencias de la API:

```bash
cd api
npm install
```

2. Crea el archivo `.env` en la carpeta `api/`

3. Inicia el servidor:

```bash
npm start
# o para desarrollo con nodemon
npm run dev
```

## Servicios Docker

- **nginx**: Sirve los archivos estáticos en el puerto 3007
- **api**: Servidor Node.js con Express en el puerto 3000

## API Endpoints

### POST /api/send-email

Envía un correo con la información del formulario de contacto.

**Body:**
```json
{
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "country": "México",
  "state": "Baja California Sur"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Correo enviado exitosamente. Nos pondremos en contacto contigo pronto.",
  "messageId": "..."
}
```

**Respuesta con errores:**
```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": ["El nombre es requerido", ...]
}
```

## Notas

- El servidor Node.js usa Nodemailer para el envío de correos
- Nginx actúa como proxy reverso para la API
- Los archivos estáticos se sirven desde la carpeta `html/`

