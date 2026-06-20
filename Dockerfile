# Debian slimベースのNode.js 18イメージを使用
FROM node:18-slim AS builder

WORKDIR /app

# 依存関係をインストールし、ビルドする
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 実行用の軽量イメージ
FROM node:18-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts

EXPOSE 3000
CMD ["npm", "start"]
