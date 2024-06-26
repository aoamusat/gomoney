FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript

COPY . .

RUN npm run build

RUN npm run db:seed

EXPOSE 5004

CMD ["node", "dist/index.js"]
