FROM python:3.9
WORKDIR /usr/src/app
RUN pip install --no-cache-dir pandas flask gunicorn scikit-learn
COPY . .
EXPOSE 8000
CMD ["python3", "-m", "gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "webapp_flask:app"]
