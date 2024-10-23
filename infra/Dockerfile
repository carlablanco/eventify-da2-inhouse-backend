FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv
RUN python3 -m venv /usr/src/app/venv
RUN . /usr/src/app/venv/bin/activate && pip install --no-cache-dir pandas flask gunicorn scikit-learn
ENV PYTHONPATH=/usr/src/app
COPY . .
EXPOSE 3001 8000
RUN chmod +x /usr/src/app/start.sh
CMD ["/bin/bash", "-c", ". /usr/src/app/venv/bin/activate && ./start.sh"]
