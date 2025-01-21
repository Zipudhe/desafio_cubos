FROM node:18.18

WORKDIR cubos_app

COPY . .

RUN npm i -y

EXPOSE 3000
