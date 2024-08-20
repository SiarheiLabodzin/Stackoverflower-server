FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

RUN export $(grep -v '^#' .env | xargs)

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]