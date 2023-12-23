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

COPY httpd.conf /usr/local/apache2/conf/httpd.conf

COPY --from=angular /srv/sonddr/dist/sonddr-webapp/ /usr/local/apache2/htdocs/
