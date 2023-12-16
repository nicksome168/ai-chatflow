# Stage 1: Build the React application
FROM node:alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN ls -la
EXPOSE 3000
CMD ["npm", "start"]