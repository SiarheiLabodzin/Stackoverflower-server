FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY .env .env

RUN npm run build

WORKDIR /app/dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]