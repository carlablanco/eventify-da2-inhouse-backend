FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN apt-get update && \
    apt-get install -y python3 python3-pip
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
