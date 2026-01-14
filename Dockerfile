FROM node:20-alpine

# Install basic tooling
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency manifests first (better caching)
COPY package.json package-lock.json ./

# Install deps (dev deps included)
RUN npm install

# Copy the rest of the app (including .env)
COPY . .

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Expose Next.js dev port
EXPOSE 3000

# Start Next.js dev server
CMD ["npm", "run", "dev"]
