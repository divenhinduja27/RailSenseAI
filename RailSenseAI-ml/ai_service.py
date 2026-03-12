from fastapi import FastAPI, HTTPException
import pandas as pd
import networkx as nx
import joblib
import random

print("RUNNING FILE:", __file__)

app = FastAPI()

# ---------------- CONFIG ----------------

AVG_TRAIN_SPEED = 70  # km per hour

# ---------------- LOAD DATA ----------------

stations = pd.read_csv("data/stations.csv")
routes_df = pd.read_csv("data/routes.csv")

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

for _, row in routes_df.iterrows():

    distance = random.randint(200, 1200)

    G.add_edge(
        row["source"],
        row["destination"],
        distance=distance
    )

print("Graph ready")

# ---------------- HELPER FUNCTIONS ----------------

def calculate_distance(path):
    total = 0
    for i in range(len(path) - 1):
        total += G[path[i]][path[i + 1]]["distance"]
    return total


def create_ml_input(distance, season="Winter", frequency="Daily"):

    feature_names = delay_model.feature_names_in_

    row = {f: 0 for f in feature_names}

    if "Distance(Km)" in row:
        row["Distance(Km)"] = distance

    season_col = f"Season_{season}"
    if season_col in row:
        row[season_col] = 1

    freq_col = f"Run_frequency_{frequency}"

    for col in row:
        if freq_col.strip() in col.replace("\xa0", " ").strip():
            row[col] = 1

    return pd.DataFrame([row])


def calculate_congestion(station):

    neighbors = list(G.neighbors(station))
    degree = len(neighbors)

    if degree >= 7:
        return "High"
    elif degree >= 4:
        return "Medium"
    else:
        return "Low"


# ---------------- ROUTE API ----------------

@app.get("/route")
def get_route(source: str, destination: str):

    if source not in G.nodes or destination not in G.nodes:
        raise HTTPException(status_code=400, detail="Invalid station code")

    path = nx.shortest_path(G, source, destination, weight="distance")

    return {"route": path}


# ---------------- ALTERNATIVE ROUTES ----------------

@app.get("/alternative-routes")
def get_alt_routes(source: str, destination: str):

    if source not in G.nodes or destination not in G.nodes:
        raise HTTPException(status_code=400, detail="Invalid station code")

    try:
        paths = nx.shortest_simple_paths(G, source, destination, weight="distance")

        alt_routes = []

        for i, path in enumerate(paths):
            alt_routes.append(path)

            if i == 2:
                break

        return {"routes": alt_routes}

    except nx.NetworkXNoPath:
        raise HTTPException(status_code=404, detail="No route found")


# ---------------- DELAY PREDICTION ----------------

@app.post("/predict-delay")
def predict_delay(distance: float, season: str = "Winter", frequency: str = "Daily"):

    input_data = create_ml_input(distance, season, frequency)

    prediction = delay_model.predict(input_data)

    return {
        "predicted_delay_minutes": float(prediction[0])
    }


# ---------------- SMART ROUTE ----------------

@app.get("/smart-route")
def smart_route(source: str, destination: str):

    if source not in G.nodes or destination not in G.nodes:
        raise HTTPException(status_code=400, detail="Invalid station code")

    try:

        paths_generator = nx.shortest_simple_paths(G, source, destination, weight="distance")

        evaluated_routes = []

        best_route = None
        best_score = float("inf")
        best_distance = 0
        best_delay = 0

        for i, path in enumerate(paths_generator):

            distance = calculate_distance(path)

            input_data = create_ml_input(distance)
            delay = delay_model.predict(input_data)[0]

            travel_time_minutes = (distance / AVG_TRAIN_SPEED) * 60

            total_time = travel_time_minutes + delay

            evaluated_routes.append({
                "route": path,
                "distance_km": distance,
                "predicted_delay": float(delay),
                "travel_time_minutes": travel_time_minutes,
                "total_travel_time_minutes": total_time
            })

            if total_time < best_score:
                best_score = total_time
                best_route = path
                best_distance = distance
                best_delay = delay

            if i == 2:
                break

        source_congestion = calculate_congestion(source)
        destination_congestion = calculate_congestion(destination)

        return {
            "best_route": best_route,
            "distance_km": best_distance,
            "predicted_delay_minutes": float(best_delay),
            "best_total_travel_time_minutes": best_score,
            "source_congestion": source_congestion,
            "destination_congestion": destination_congestion,
            "evaluated_routes": evaluated_routes
        }

    except nx.NetworkXNoPath:
        raise HTTPException(status_code=404, detail="No route found")


# ---------------- TICKET CONFIRMATION ----------------

@app.get("/ticket-confirmation", tags=["Ticket"])
def ticket_confirmation(waitlist: int, days_before: int):

    probability = (days_before / 10) * (1 - waitlist / 100)

    probability = max(0, min(probability, 1))

    return {
        "waitlist_number": waitlist,
        "days_before_travel": days_before,
        "confirmation_probability": round(probability, 2)
    }


# ---------------- TEST API ----------------

@app.get("/test-api")
def test_api():
    return {"message": "THIS IS THE CORRECT FILE"}


print("ENDPOINTS LOADED")