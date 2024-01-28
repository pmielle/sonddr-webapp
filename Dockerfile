FROM node:20

WORKDIR /srv/sonddr

RUN npm install -g @angular/cli

CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
