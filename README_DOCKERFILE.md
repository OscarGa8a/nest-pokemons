FROM node:18-alpine3.15

# Set working directory

RUN mkdir -p /var/www/pokedex
WORKDIR /var/www/pokedex

# Copiar el directorio y su contenido

COPY . ./var/www/pokedex
COPY package.json tsconfig.json tsconfig.build.json /var/www/pokedex/
RUN yarn install --prod
RUN yarn build

# Dar permiso para ejecutar la applicación

RUN adduser --disabled-password pokeuser
RUN chown -R pokeuser:pokeuser /var/www/pokedex
USER pokeuser

# Limpiar el caché

RUN yarn cache clean --force

EXPOSE 3000

CMD [ "yarn","start" ]

# Explicación Detallada del Dockerfile

Este documento explica paso a paso el archivo `Dockerfile` utilizado en este proyecto NestJS Pokedex. Si eres nuevo en Docker, aquí entenderás cómo funciona cada línea y por qué es importante.

---

## 1. FROM node:18-alpine3.15

Usa una imagen base de Node.js 18 sobre Alpine Linux 3.15, un sistema operativo ligero. Es como empezar con una computadora que ya tiene Node.js instalado.

## 2. RUN mkdir -p /var/www/pokedex

Crea la carpeta `/var/www/pokedex` dentro del contenedor. El parámetro `-p` asegura que se creen todas las carpetas necesarias.

## 3. WORKDIR /var/www/pokedex

Establece el directorio de trabajo. Todos los comandos siguientes se ejecutarán desde aquí, como si hicieras `cd /var/www/pokedex`.

## 4. COPY . ./var/www/pokedex

Copia todos los archivos de tu proyecto al contenedor, dentro de la carpeta de trabajo. Así tu código estará disponible para ejecutarse.

## 5. COPY package.json tsconfig.json tsconfig.build.json /var/www/pokedex/

Copia archivos de configuración importantes. Aunque el paso anterior ya copia todo, este asegura que estos archivos estén presentes para instalar dependencias y compilar el proyecto.

## 6. RUN yarn install --prod

Instala las dependencias de producción definidas en `package.json`. No instala las dependencias de desarrollo, haciendo la imagen más ligera.

## 7. RUN yarn build

Compila el código TypeScript a JavaScript, preparándolo para ejecutarse en Node.js.

## 8. RUN adduser --disabled-password pokeuser

Crea un usuario llamado `pokeuser` sin contraseña, para ejecutar la aplicación de forma segura.

## 9. RUN chown -R pokeuser:pokeuser /var/www/pokedex

Cambia el propietario de todos los archivos a `pokeuser`, reforzando la seguridad.

## 10. USER pokeuser

A partir de aquí, todos los comandos se ejecutan como el usuario `pokeuser`.

## 11. RUN yarn cache clean --force

Limpia la caché de Yarn para reducir el tamaño de la imagen eliminando archivos temporales.

## 12. EXPOSE 3000

Indica que la aplicación usará el puerto 3000. Cuando ejecutes el contenedor, puedes mapear este puerto para acceder a la app desde tu máquina.

## 13. CMD [ "yarn","start" ]

Define el comando que se ejecuta al iniciar el contenedor: `yarn start`, que arranca la aplicación NestJS.

---

## Resumen

Este Dockerfile crea una imagen que:

- Usa Node.js 18 sobre Alpine Linux
- Copia tu código fuente y archivos de configuración
- Instala dependencias y compila el proyecto
- Configura un usuario seguro
- Limpia archivos innecesarios
- Expone el puerto 3000
- Inicia la aplicación automáticamente

Con esta imagen, puedes ejecutar tu aplicación en cualquier entorno con Docker, sin preocuparte por instalar Node.js o dependencias manualmente.
