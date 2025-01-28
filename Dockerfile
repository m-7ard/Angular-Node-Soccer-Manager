# frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./ 
RUN npm install
COPY frontend/ ./ 
RUN npm run build
# Add debugging step to list contents of dist directory
RUN ls -l /app/frontend/dist/frontend

# backend
FROM node:18
WORKDIR /app/backend
COPY backend/package*.json ./ 
RUN npm install
COPY backend/ ./ 
RUN npm run build
# in /app/backend/dist

RUN mkdir -p /app/backend/dist/api/static && \
    chown -R $APP_UID:$APP_UID /app

# Assuming the build output from frontend is correct
COPY --from=frontend-builder /app/frontend/dist/frontend/browser /app/backend/dist/api/static

EXPOSE 3000
CMD ["node", "dist/index.js"]