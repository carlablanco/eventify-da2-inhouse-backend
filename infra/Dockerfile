FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN apt-get update && \
    apt-get install -y python3 python3-pip
RUN pip3 install flask gunicorn
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
