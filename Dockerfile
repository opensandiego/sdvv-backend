FROM node:18 As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .


FROM build AS development

ENV NODE_ENV development


FROM build AS production

ENV NODE_ENV production

RUN npm run build


FROM production AS web

CMD [ "npm", "run", "start:prod:web" ]


FROM production AS worker

CMD [ "npm", "run", "start:prod:worker" ]


FROM production AS updater

CMD [ "npm", "run", "start:prod:updater" ]
