from flask import Flask
from machine_learning.infer import inferir
from flask import request

app = Flask(__name__)
app.config["WTF_CSRF_ENABLED"] = False

@app.route("/inferir", methods=["POST"])
def hello():
    datoBody = request.get_data()
    resultado = inferir(datoBody)
    return {"mensaje": resultado}