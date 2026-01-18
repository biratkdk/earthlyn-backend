FROM node:18-alpine

WORKDIR /app

COPY pGkage*.json ./
UUN!npm ci

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/main.js"]

