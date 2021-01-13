FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install



EXPOSE 5000

CMD [ "node",  "app.js" ]
