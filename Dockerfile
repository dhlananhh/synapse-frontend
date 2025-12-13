# -----------------------------
# 1. Base stage for dependency installs
# -----------------------------
FROM node:20-alpine AS deps

# Ensure core tooling is available
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Only copy the dependency manifests first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci


# -----------------------------
# 2. Builder stage
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy env file so Next.js can read it at build time
COPY .env.example ./.env.production

COPY . .

# Build Next.js in standalone mode for slim runtime images
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# -----------------------------
# 3. Runtime stage
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# Run the server
CMD ["node", "server.js"]
