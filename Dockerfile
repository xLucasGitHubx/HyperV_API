# Dockerfile

FROM node:22-alpine3.20

WORKDIR /app

# Copie des dépendances
COPY package*.json ./
RUN npm install

# Copie du reste des fichiers
COPY . .

# Expose le port
EXPOSE 3000

# Démarrage : migrations Drizzle + API
CMD npx drizzle-kit generate:pg && \
    npx drizzle-kit push:pg && \
    npm run dev
