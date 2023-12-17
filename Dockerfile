FROM node:20

WORKDIR /srv/sonddr

COPY package.json .
RUN npm install

COPY . .

RUN (cd sonddr-shared && npm run build)

EXPOSE 4200

CMD ["npm", "start"]
