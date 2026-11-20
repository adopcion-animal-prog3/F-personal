# Etapa 1: compila la SPA de React con Vite.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Las VITE_* quedan embebidas en el bundle: solo URLs públicas, nunca secretos.
ARG VITE_API_URL=/
ARG VITE_PROFESIONAL_URL=/profesional/
ENV VITE_API_URL=$VITE_API_URL \
    VITE_PROFESIONAL_URL=$VITE_PROFESIONAL_URL
RUN npm run build

# Etapa 2: sirve los archivos estáticos y reenvía /api al backend B-Personal.
FROM nginx:1.27-alpine
ENV API_UPSTREAM=http://b-personal:8000
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
