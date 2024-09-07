FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 9001
CMD npm run start:dev