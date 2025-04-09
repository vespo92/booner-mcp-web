FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./
# Try different install methods in case one fails
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps || npm install --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Use environment variable to bypass TypeScript and ESLint checks
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Accept build arguments for client-side environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_OLLAMA_API_URL
ARG NEXT_PUBLIC_AUTH_SECRET

# Set environment variables during build time
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_OLLAMA_API_URL=${NEXT_PUBLIC_OLLAMA_API_URL}
ENV NEXT_PUBLIC_AUTH_SECRET=${NEXT_PUBLIC_AUTH_SECRET}

# Build with flags to bypass TypeScript and ESLint
RUN npm run build:docker

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/advanced-features/output-file-tracing
CMD ["node", "server.js"]
