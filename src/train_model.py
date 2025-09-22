import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Load the CSV
df = pd.read_csv("user_preferences.csv")

# Convert recommendations from string to list
df['recommendations'] = df['recommendations'].apply(lambda x: x.split(', '))

# Multi-label encoding for recommendations
mlb = MultiLabelBinarizer()
Y = mlb.fit_transform(df['recommendations'])

# Features: one-hot encode categorical variables
X = pd.get_dummies(df[['outdoor', 'foodie', 'budget', 'hobby']])

# Split dataset
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# Train MultiOutputClassifier with RandomForest
clf = MultiOutputClassifier(RandomForestClassifier(n_estimators=100, random_state=42))
clf.fit(X_train, Y_train)

# Evaluate
predictions = clf.predict(X_test)
print("Accuracy:", accuracy_score(Y_test, predictions))

# Save the trained model and the label encoder
joblib.dump(clf, "date_recommender_model.pkl")
joblib.dump(mlb, "mlb_encoder.pkl")

print("Model and encoder saved!")
