FROM node:18-alpine

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json ./
RUN npm install --production

# Copiar el código de la aplicación
COPY server.js ./

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]

