FROM node:18.18

WORKDIR cubos_app

COPY package.json /cubos_app
RUN npm i -y

COPY . /cubos_app

EXPOSE 8080

CMD ["npm", "run", "dev"]
