# @tailwindcss/oxide 4.x は Node >= 20 が必要
FROM node:20-slim AS builder

WORKDIR /app

ARG TARGETARCH

COPY package*.json ./
# macOS で生成した lockfile では Linux 向け optional deps が欠けることがあるため補完する
RUN npm ci \
    && case "$TARGETARCH" in \
         arm64) npm install --no-save @next/swc-linux-arm64-gnu @tailwindcss/oxide-linux-arm64-gnu ;; \
         amd64) npm install --no-save @next/swc-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu ;; \
       esac
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json
RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["npm", "start"]
