# node
# -----------------------------------------------
FROM node:20 as angular

WORKDIR /srv/sonddr

COPY package.json .
RUN npm install

COPY . .

RUN (cd sonddr-shared && npm run build)
RUN npm run build


# apache
# -----------------------------------------------
FROM httpd:2.4

WORKDIR /usr/local/apache2/htdocs
COPY --from=angular /srv/sonddr/dist/sonddr-webapp .
