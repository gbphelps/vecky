FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./src/server ./src/server

RUN npx tsc -p src/server/tsconfig.json

COPY ./src/frontend ./src/frontend

RUN npx webpack --config=src/frontend/webpack.config.js

EXPOSE 3000

CMD ["node", "src/server/dist/index.js"]