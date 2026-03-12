import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

# ---------------- LOAD DATA ----------------

data = pd.read_csv("../raw-data/indian_railway_delay_data_.csv")

print(data.head())
print(data.columns)

# ---------------- INSPECT DELAY VALUES ----------------

print("\nSample delay values:")
print(data["Dealy_min"].unique()[:20])

# ---------------- CLEAN DELAY COLUMN ----------------

data["delay_minutes"] = pd.to_timedelta(
    data["Dealy_min"], errors="coerce"
).dt.total_seconds() / 60

# remove invalid rows
data = data.dropna(subset=["delay_minutes"])

# ---------------- SELECT FEATURES ----------------

X = data[["Distance(Km)", "Season", "Run_frequency"]]
y = data["delay_minutes"]

# ---------------- ENCODE CATEGORICAL VARIABLES ----------------

X = pd.get_dummies(X)

print("\nTraining features:")
print(X.columns)

# ---------------- TRAIN TEST SPLIT ----------------

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------- TRAIN MODEL ----------------

model = RandomForestRegressor()

model.fit(X_train, y_train)

print("\nModel trained successfully")

# ---------------- TEST MODEL ----------------

prediction = model.predict(X_test.iloc[[0]])

print("\nPredicted delay:", prediction[0], "minutes")
print("Actual delay:", y_test.iloc[0])

# ---------------- SAVE MODEL ----------------

joblib.dump(model, "../models/delay_model.pkl")

print("\nModel saved to ../models/delay_model.pkl")