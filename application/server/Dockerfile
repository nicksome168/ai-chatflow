# Stage 1: Build the React application
FROM node:alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4000
CMD ["npm", "start"]