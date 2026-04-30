FROM paragu-ai/next-base:node20 AS deps
WORKDIR /app
COPY web/package.json web/package-lock.json* ./
RUN npm install --legacy-peer-deps

FROM paragu-ai/next-base:node20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY web/ .
COPY src/ ./src/
COPY sites/ ./sites/
COPY public/ ./public/
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM paragu-ai/next-base:node20 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
USER nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/sites ./sites
EXPOSE 3000
CMD ["node", "server.js"]
