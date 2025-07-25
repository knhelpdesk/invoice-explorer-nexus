# Multi-stage build for Office 365 Invoice Search Tool
FROM node:18-alpine AS backend-builder

# Set working directory for backend
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
COPY backend/tsconfig.json ./

# Install backend dependencies (including dev dependencies for build)
RUN npm install

# Copy backend source code
COPY backend/src ./src

# Build backend
RUN npm run build

# Clean install production dependencies only
RUN rm -rf node_modules && npm install --omit=dev

# Frontend build stage
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY src ./src
COPY public ./public
COPY index.html ./

# Build frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S office365 -u 1001

# Copy backend build and dependencies
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package.json ./backend/

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Install serve to host frontend
RUN npm install -g serve

# Create logs directory and set proper ownership
RUN mkdir -p logs && \
    chown -R office365:nodejs /app && \
    chmod 755 /app && \
    chmod 755 logs

# Switch to non-root user
USER office365

# Expose ports
EXPOSE 3001 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start both frontend and backend
CMD ["dumb-init", "sh", "-c", "serve -s frontend/dist -l 3000 & cd backend && node dist/server.js"]
