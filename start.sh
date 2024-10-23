#!/bin/bash

# Nodejs para el back
npm start &

# Gunicorn con flask para python
python3 -m gunicorn -w 4 -b 0.0.0.0:8000 webapp_flask:app
