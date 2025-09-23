import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. Load dataset
data = pd.read_csv("user_preferences.csv")

# 2. Encode categorical features
budget_encoder = LabelEncoder()
hobby_encoder = LabelEncoder()
rec_encoder = LabelEncoder()

data["budget_encoded"] = budget_encoder.fit_transform(data["budget"])
data["hobby_encoded"] = hobby_encoder.fit_transform(data["hobby"])
data["rec_encoded"] = rec_encoder.fit_transform(data["recommendations"])

# 3. Define features (X) and target (y)
X = data[["outdoor", "foodie", "budget_encoded", "hobby_encoded"]]
y = data["rec_encoded"]

# 4. Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# 5. Save model + encoders
joblib.dump(model, "date_model.pkl")
joblib.dump(budget_encoder, "budget_encoder.pkl")
joblib.dump(hobby_encoder, "hobby_encoder.pkl")
joblib.dump(rec_encoder, "rec_encoder.pkl")

print("✅ Model and encoders trained & saved!")
