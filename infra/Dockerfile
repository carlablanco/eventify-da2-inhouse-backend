FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install --no-cache-dir pandas flask gunicorn scikit-learn
COPY . .
EXPOSE 3001 8000
RUN chmod +x /usr/src/app/start.sh
CMD ["./start.sh"]
