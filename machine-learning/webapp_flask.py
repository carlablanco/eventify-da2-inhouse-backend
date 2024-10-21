from flask import Flask
from infer import inferir
from flask import request

app = Flask(__name__)

@app.route("/inferir", methods=["POST"])
def hello():
    datoBody = request.get_data()
    resultado = inferir(datoBody)
    return {"mensaje": resultado}