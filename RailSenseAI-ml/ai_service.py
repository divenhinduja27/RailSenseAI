from fastapi import FastAPI
import pandas as pd
import networkx as nx
import joblib
import random

app = FastAPI()

# ---------------- LOAD DATA ----------------

stations = pd.read_csv("data/stations.csv")
routes = pd.read_csv("data/routes.csv")

delay_model = joblib.load("models/delay_model.pkl")

# ---------------- BUILD GRAPH ----------------

G = nx.Graph()

for _, row in stations.iterrows():
    G.add_node(
        row["station_code"],
        name=row["station_name"],
        lat=row["latitude"],
        lon=row["longitude"]
    )

for _, row in routes.iterrows():

    distance = random.randint(200,1200)

    G.add_edge(
        row["source"],
        row["destination"],
        distance=distance
    )

print("Graph ready")

# ---------------- ROUTE API ----------------

@app.get("/route")
def get_route(source: str, destination: str):

    path = nx.shortest_path(G, source, destination, weight="distance")

    return {
        "route": path
    }

# ---------------- ALTERNATIVE ROUTES ----------------

@app.get("/alternative-routes")
def get_alt_routes(source: str, destination: str):

    paths = list(nx.shortest_simple_paths(G, source, destination, weight="distance"))

    return {
        "routes": paths[:3]
    }

# ---------------- DELAY PREDICTION ----------------

@app.post("/predict-delay")
def predict_delay(distance: float, season: str, frequency: str):

    input_data = pd.DataFrame([{
        "Distance(Km)": distance,
        f"Season_{season}": 1,
        f"Run_frequency_{frequency}": 1
    }])

    prediction = delay_model.predict(input_data)

    return {
        "predicted_delay_minutes": float(prediction[0])
    }