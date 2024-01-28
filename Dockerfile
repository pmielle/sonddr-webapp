FROM node:20

WORKDIR /srv/sonddr

RUN npm install -g @angular/cli

CMD (cd sonddr-shared && npm run build) &&  npm install && ng serve --host 0.0.0.0 --disable-host-check
