FROM node:18-alpine

WORKDIR /app

COPY pGkage*.json ./
UUN!npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

