from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)

# Load trained ML model and encoders
with open("date_model.pkl", "rb") as f:
    model = pickle.load(f)
with open("budget_encoder.pkl", "rb") as f:
    budget_encoder = pickle.load(f)
with open("hobby_encoder.pkl", "rb") as f:
    hobby_encoder = pickle.load(f)
with open("rec_encoder.pkl", "rb") as f:
    rec_encoder = pickle.load(f)

@app.route("/api/recommendations", methods=["POST"])
def get_recommendations():
    try:
        user_answers = request.json

        # Encode categorical features
        budget_enc = budget_encoder.transform([user_answers.get("budget", "Low")])[0]
        hobby_enc = hobby_encoder.transform([user_answers.get("hobby", "Cooking")])[0]

        input_df = pd.DataFrame([{
            "outdoor": int(user_answers.get("outdoor", 0)),
            "foodie": int(user_answers.get("foodie", 0)),
            "budget_encoded": budget_enc,
            "hobby_encoded": hobby_enc
        }])

        # Predict & decode
        recommended_encoded = model.predict(input_df)[0]
        recommended = rec_encoder.inverse_transform([recommended_encoded])[0]
        recommended_list = [item.strip() for item in recommended.split(",")]

        return jsonify({"success": True, "recommendations": recommended_list})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)

