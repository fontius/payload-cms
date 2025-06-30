# 1. Base image with full dependencies for building
FROM node:18-alpine AS base
WORKDIR /app
# Install dependencies first for better caching
COPY package.json package-lock.json* ./
RUN npm install

# 2. Builder stage
FROM base AS builder
WORKDIR /app
COPY . .
# This script compiles TS and builds the Payload admin panel
RUN npm run build

# 3. Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy production dependencies from the 'base' stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Copy built application artifacts from the 'builder' stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["npm", "run", "serve"]