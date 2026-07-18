# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Installs all dependencies (including dev dependencies for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Generates the Prisma client and builds TypeScript/code (if build script exists)
RUN npx prisma generate
# If you have a build step (ex: tsc), uncomment the line below:
# RUN npm run build

# --- Stage 2: Production ---
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy only necessary files from the build stage
COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
# If you have a build folder (ex: dist or build), copy it too:
# COPY --from=builder /usr/src/app/dist ./dist

# Exposes the port that the API will listen on
EXPOSE 3000

# Command to run the application
# If using TS-Node directly in prod: npx ts-node src/server.ts
# If compiling to JS: node dist/server.js
CMD ["npx", "ts-node", "src/server.ts"]