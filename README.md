# Mobile Shop - Prueba Técnica Front-End

Mini aplicación para la compra de dispositivos móviles, desarrollada como prueba técnica.

## Requisitos previos

- Node.js >= 20.19

## Instalación

```bash
npm install
cp .env.example .env
```

## Variables de entorno

| Variable            | Descripción                     |
| ------------------- | ------------------------------- |
| `VITE_API_BASE_URL` | URL base de la API de productos |

## Scripts

| Comando                 | Descripción                        |
| ----------------------- | ---------------------------------- |
| `npm start`             | Inicia el servidor de desarrollo   |
| `npm run build`         | Genera la build de producción      |
| `npm test`              | Ejecuta los tests                  |
| `npm run test:coverage` | Ejecuta los tests con cobertura    |
| `npm run lint`          | Comprueba el código con ESLint     |
| `npm run format`        | Formatea el código con Prettier    |
| `npm run format:check`  | Comprueba el formato sin modificar |

## Tecnologías utilizadas

- **React 19** — Librería de UI
- **Vite 8** — Servidor de desarrollo y empaquetador
- **React Router v7** — Enrutado en cliente (SPA)
- **Vitest** — Framework de testing
- **ESLint** — Análisis estático de código

## Arquitectura

La aplicación consta de dos vistas:

- **PLP (Product List Page)** — Listado de productos con búsqueda en tiempo real por marca y modelo
- **PDP (Product Detail Page)** — Detalle del producto con selección de color y almacenamiento, y opción de añadir al carrito

### Caché de datos

Las respuestas de la API se almacenan en `localStorage` con una expiración de 1 hora. Pasado ese tiempo, los datos se revalidan automáticamente haciendo una nueva petición al servidor.

### Carrito

El número de productos añadidos al carrito se persiste en `localStorage`, por lo que se mantiene entre navegaciones y recargas de página.

## API

Base URL: `https://itx-frontend-test.onrender.com/`

| Método | Endpoint           | Descripción                |
| ------ | ------------------ | -------------------------- |
| GET    | `/api/product`     | Listado de productos       |
| GET    | `/api/product/:id` | Detalle de un producto     |
| POST   | `/api/cart`        | Añadir producto al carrito |
