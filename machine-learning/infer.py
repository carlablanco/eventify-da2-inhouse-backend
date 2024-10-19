import os
import pandas as pd
import joblib
import json
import argparse
import logging

logging.basicConfig(level=logging.INFO)

def inferir(json_data: str) -> int:
    try:
        parsed_data = json.loads(json_data)
    except json.JSONDecodeError as decode_error:
        logging.error(f"Error de decode del JSON: {decode_error}")
        return -1

    current_dir = os.path.dirname(os.path.realpath(__file__))
    model_file_path = os.path.join(current_dir, 'isolation_forest.pkl')

    try:
        isolation_forest_model = joblib.load(model_file_path)
    except FileNotFoundError:
        logging.error(f"Modelo no encontrado en el path: {model_file_path}")
        return -1
    except Exception as load_error:
        logging.error(f"Error cargando el modelo: {load_error}")
        return -1

    data_frame = pd.DataFrame([parsed_data])
    prediction = isolation_forest_model.predict(data_frame)

    # -1 (anomalía) y 1 (normal)
    result = 1 if prediction[0] == -1 else 0

    return result

def main():
    parser = argparse.ArgumentParser(description="Script de detección de logins maliciosos")
    parser.add_argument("json_data", type=str, help="La data a ser analizada en JSON string")
    args = parser.parse_args()

    result = inferir(args.json_data)
    logging.info(f"Resultado: {result}")

if __name__ == "__main__":
    main()
