# frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# backend
FROM node:18
WORKDIR /app/src
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

COPY --from=frontend-builder /app/frontend/dist/frontend /app/src/api/static
EXPOSE 3000
CMD ["node", "src/index.js"]
