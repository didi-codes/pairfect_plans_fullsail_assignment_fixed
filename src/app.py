from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)

# Load the trained ML model
with open("date_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/api/recommendations", methods=["POST"])
def get_recommendations():
    try:
        user_answers = request.json
        input_df = pd.DataFrame([user_answers])
        recommended = model.predict(input_df)[0]
        recommended_list = [item.strip() for item in recommended.split(",")]
        return jsonify({"success": True, "recommendations": recommended_list})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)

