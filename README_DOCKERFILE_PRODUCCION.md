# Install dependencies only when needed

FROM node:18-alpine3.15 AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the app with cache dependencies

FROM node:18-alpine3.15 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production image, copy all the files and run next

FROM node:18-alpine3.15 AS runner

# Set working directory

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --prod

COPY --from=builder /app/dist ./dist

# # Copiar el directorio y su contenido

# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app

# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación

# RUN adduser --disabled-password pokeuser

# RUN chown -R pokeuser:pokeuser ./pokedex

# USER pokeuser

# EXPOSE 3000

CMD [ "node","dist/main" ]

# Explicación Detallada del Dockerfile para Producción

Este documento explica paso a paso el archivo `Dockerfile` utilizado en el proyecto NestJS Pokedex para crear una imagen de producción. Si eres nuevo en Docker, aquí entenderás cómo funciona cada línea y por qué es importante.

---

## ¿Qué es un Dockerfile?

Un Dockerfile es un archivo de texto que contiene instrucciones para construir una imagen de Docker. Una imagen es como una plantilla que Docker usa para crear contenedores, que son instancias ejecutables de esa imagen.

Este Dockerfile utiliza construcción multi-etapa para optimizar el resultado final.

---

## Análisis línea por línea

### Etapa 1: Dependencias

```dockerfile
FROM node:18-alpine3.15 AS deps
```

Usa Node.js 18 sobre Alpine Linux 3.15 como imagen base. `AS deps` nombra esta etapa para referenciarla después.

```dockerfile
RUN apk add --no-cache libc6-compat
```

Instala la biblioteca `libc6-compat` necesaria para algunas dependencias de Node.js.

```dockerfile
WORKDIR /app
```

Establece el directorio de trabajo dentro del contenedor.

```dockerfile
COPY package.json yarn.lock ./
```

Copia los archivos de dependencias al contenedor.

```dockerfile
RUN yarn install --frozen-lockfile
```

Instala todas las dependencias de Node.js exactamente como están en `yarn.lock`.

---

### Etapa 2: Construcción

```dockerfile
FROM node:18-alpine3.15 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build
```

Comienza una nueva etapa llamada "builder". Reutiliza las dependencias instaladas en la etapa anterior, copia todo el código fuente y compila el código TypeScript a JavaScript en la carpeta `dist`.

---

### Etapa 3: Producción

```dockerfile
FROM node:18-alpine3.15 AS runner
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --prod
COPY --from=builder /app/dist ./dist
CMD [ "node","dist/main" ]
```

Comienza la etapa final para la imagen de producción. Instala solo las dependencias de producción, copia el código compilado y define el comando que se ejecutará al iniciar el contenedor.

---

## Secciones comentadas

Hay líneas comentadas que muestran configuraciones alternativas, como crear un usuario sin privilegios, copiar archivos de entorno, y exponer el puerto 3000.

---

## Resumen

Este Dockerfile crea una imagen final que:

- Usa Node.js 18 sobre Alpine Linux
- Instala dependencias y compila el proyecto
- Copia solo el código necesario para producción
- Inicia la aplicación automáticamente

Para construir y ejecutar la imagen:

```powershell
docker build -t pokedex-app .
docker run -p 3000:3000 pokedex-app
```

Esto construye la imagen y ejecuta el contenedor, mapeando el puerto 3000 del contenedor al de tu máquina.

Con este proceso, puedes ejecutar tu aplicación en cualquier entorno con Docker, sin preocuparte por instalar Node.js o dependencias manualmente.
