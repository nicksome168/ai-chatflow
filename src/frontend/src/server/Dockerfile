FROM node:alpine AS img


WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production

COPY . .

FROM node:alpine

WORKDIR /usr/src/app
COPY --from=img /usr/src/app ./
RUN mkdir /root/.aws/
COPY credentials /root/.aws/

EXPOSE 8080
CMD ["node", "server.js"]