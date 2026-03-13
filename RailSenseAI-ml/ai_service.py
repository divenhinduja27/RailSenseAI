from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import networkx as nx
import joblib
import random
import ollama

print("RUNNING FILE:", __file__)

app = FastAPI()

# ---------------- CORS CONFIG ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- CONFIG ----------------

AVG_TRAIN_SPEED = 70

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
    G.add_edge(row["source"], row["destination"], distance=distance)

print("Graph ready")

# ---------------- CHAT MEMORY ----------------

conversation_memory = []

# ---------------- CITY → STATION MAP ----------------

city_station_map = {
    "mumbai": "CSTM","bombay": "CSTM",
    "delhi": "NDLS","new delhi": "NDLS",
    "old delhi": "DLI",
    "pune": "PUNE",
    "bangalore": "SBC","bengaluru": "SBC",
    "chennai": "MAS","madras": "MAS",
    "hyderabad": "HYB",
    "secunderabad": "SC",
    "nagpur": "NGP",
    "bhopal": "BPL",
    "jaipur": "JP",
    "surat": "ST",
    "ahmedabad": "ADI",
    "rajkot": "RJT",
    "lucknow": "LKO",
    "patna": "PNBE",
    "ranchi": "RNC",
    "kolkata": "HWH","howrah": "HWH",
    "kolkata chitpur": "KOAA",
    "bhubaneswar": "BBS","bhubaneshwar": "BBS",
    "visakhapatnam": "VSKP","vizag": "VSKP",
    "amritsar": "ASR",
    "jhansi": "JHS",
    "gwalior": "GWL",
    "kota": "KOTA",
    "ratlam": "RTM",
    "ujjain": "UJN",
    "madurai": "MDU",
    "trivandrum": "TVC","thiruvananthapuram": "TVC",
    "ernakulam": "ERS",
    "kalyan": "KYN"
}

# ---------------- HELPER FUNCTIONS ----------------

def calculate_distance(path):
    total = 0
    for i in range(len(path)-1):
        total += G[path[i]][path[i+1]]["distance"]
    return total


def create_ml_input(distance, season="Winter", frequency="Daily"):
    feature_names = delay_model.feature_names_in_
    row = {f:0 for f in feature_names}

    if "Distance(Km)" in row:
        row["Distance(Km)"] = distance

    season_col = f"Season_{season}"
    if season_col in row:
        row[season_col] = 1

    freq_col = f"Run_frequency_{frequency}"

    for col in row:
        if freq_col.strip() in col.replace("\xa0"," ").strip():
            row[col] = 1

    return pd.DataFrame([row])


def ask_llm(prompt):

    global conversation_memory

    conversation_memory.append({"role":"user","content":prompt})

    response = ollama.chat(
        model="phi",
        messages=[
            {
                "role":"system",
                "content":"You are a railway AI assistant helping passengers understand routes, delays and railway network analysis."
            }
        ] + conversation_memory,
        options={
            "temperature": 0.1,
            "num_ctx": 256,
            "num_predict": 80
        }
    )

    answer = response["message"]["content"]

    conversation_memory.append({"role":"assistant","content":answer})

    if len(conversation_memory) > 4:
        conversation_memory = conversation_memory[-4:]

    return answer


def extract_stations(query):

    q = query.lower()
    stations = []

    for city,code in city_station_map.items():
        if city in q:
            stations.append(code)

    for word in q.split():
        if word.upper() in G.nodes:
            stations.append(word.upper())

    if len(stations) >= 2:
        return stations[0],stations[1]

    if len(stations) == 1:
        return stations[0],None

    return None,None


# ---------------- ROUTING ----------------

@app.get("/route", tags=["Routing"])
def get_route(source:str,destination:str):

    if source not in G.nodes or destination not in G.nodes:
        raise HTTPException(status_code=400,detail="Invalid station")

    path = nx.shortest_path(G,source,destination,weight="distance")

    return {"route":path}


@app.get("/alternative-routes", tags=["Routing"])
def alternative_routes(source:str,destination:str):

    paths = nx.shortest_simple_paths(G,source,destination,weight="distance")

    routes=[]
    for i,p in enumerate(paths):
        routes.append(p)
        if i==2:
            break

    return {"routes":routes}


# ---------------- SMART ROUTE ----------------

@app.get("/smart-route", tags=["Routing"])
def smart_route(source:str,destination:str):

    paths = nx.shortest_simple_paths(G,source,destination,weight="distance")

    evaluated=[]

    best=None
    best_score=999999

    for i,path in enumerate(paths):

        dist = calculate_distance(path)

        delay = delay_model.predict(create_ml_input(dist))[0]

        travel = (dist/AVG_TRAIN_SPEED)*60
        total = travel + delay

        evaluated.append({
            "route":path,
            "distance_km":dist,
            "predicted_delay":float(delay),
            "travel_time_minutes":travel,
            "total_travel_time_minutes":total
        })

        if total < best_score:
            best_score = total
            best = path
            best_dist = dist
            best_delay = delay

        if i==2:
            break

    return {
        "best_route":best,
        "distance_km":best_dist,
        "predicted_delay_minutes":float(best_delay),
        "best_total_travel_time_minutes":best_score,
        "evaluated_routes":evaluated
    }


# ---------------- DELAY PREDICTION ----------------

@app.post("/predict-delay", tags=["Delay Prediction"])
def predict_delay(distance:float):

    pred = delay_model.predict(create_ml_input(distance))[0]

    return {"predicted_delay_minutes":float(pred)}


# ---------------- TICKET CONFIRMATION ----------------

@app.get("/ticket-confirmation", tags=["Ticket Prediction"])
def ticket_confirmation(waitlist:int,days_before:int):

    prob = (days_before/10)*(1-waitlist/100)
    prob = max(0,min(prob,1))

    return {
        "waitlist_number":waitlist,
        "days_before_travel":days_before,
        "confirmation_probability":round(prob,2)
    }


# ---------------- PASSENGER DEMAND ----------------

@app.get("/station-demand", tags=["Passenger Demand"])
def station_demand(station:str):

    if station not in G.nodes:
        raise HTTPException(status_code=400,detail="Invalid station")

    connections = len(list(G.neighbors(station)))

    if connections>=7:
        level="High"
    elif connections>=4:
        level="Medium"
    else:
        level="Low"

    return {
        "station":station,
        "connections":connections,
        "demand_level":level
    }


# ---------------- CRITICAL STATIONS ----------------

@app.get("/critical-stations", tags=["Network Analysis"])
def critical_stations():

    centrality = nx.betweenness_centrality(G)

    top = sorted(centrality.items(),key=lambda x:x[1],reverse=True)[:5]

    return {"critical_stations":top}


# ---------------- DELAY CASCADE ----------------

@app.get("/delay-impact", tags=["Delay Analysis"])
def delay_impact(station:str):

    direct=list(G.neighbors(station))
    secondary=set()

    for s in direct:
        for n in G.neighbors(s):
            if n!=station and n not in direct:
                secondary.add(n)

    return {
        "initial_station":station,
        "directly_affected":direct,
        "secondary_impact":list(secondary)
    }


# ---------------- AI ASSISTANT ----------------

@app.get("/chat", tags=["AI Assistant"])
def chat(query: str):

    q = query.lower()

    source, destination = extract_stations(query)

    # ---------------- ROUTE INTENT ----------------
    if ("route" in q or "best way" in q or "travel" in q) and source and destination:

        result = smart_route(source, destination)

        route = " → ".join(result["best_route"])

        prompt = f"""
A passenger wants to travel.

Best route: {route}
Predicted delay: {result['predicted_delay_minutes']} minutes
Total travel time: {result['best_total_travel_time_minutes']} minutes

Explain this route in simple terms for the passenger.
"""

        explanation = ask_llm(prompt)

        return {
            "intent": "smart_route",
            "route_result": result,
            "assistant_response": explanation
        }

    # ---------------- DELAY INTENT ----------------
    if "delay" in q or "disruption" in q:

        station, _ = extract_stations(query)

        if station:

            result = delay_impact(station)

            prompt = f"""
A delay occurred at station {station}.

Directly affected stations: {result['directly_affected']}
Secondary impact stations: {result['secondary_impact']}

Explain how the delay spreads through the railway network.
"""

            explanation = ask_llm(prompt)

            return {
                "intent": "delay_analysis",
                "delay_impact": result,
                "assistant_response": explanation
            }

    # ---------------- CRITICAL HUB INTENT ----------------
    if "critical" in q or "important station" in q or "hub" in q:

        result = critical_stations()

        prompt = f"""
The most critical railway stations based on network centrality are:

{result['critical_stations']}

Explain why these stations are important in the railway network.
"""

        explanation = ask_llm(prompt)

        return {
            "intent": "critical_stations",
            "critical_stations": result,
            "assistant_response": explanation
        }

    # ---------------- DEMAND / CONGESTION ----------------
    if "crowd" in q or "busy" in q or "demand" in q:

        station, _ = extract_stations(query)

        if station:

            result = station_demand(station)

            prompt = f"""
Station: {station}
Connections: {result['connections']}
Demand level: {result['demand_level']}

Explain what this demand level means for passengers.
"""

            explanation = ask_llm(prompt)

            return {
                "intent": "station_demand",
                "station_demand": result,
                "assistant_response": explanation
            }

    # ---------------- TICKET CONFIRMATION ----------------
    if "ticket" in q or "waitlist" in q or "confirm" in q:

        result = ticket_confirmation(waitlist=20, days_before=10)

        prompt = f"""
Ticket confirmation probability is {result['confirmation_probability']}.

Explain what this means for the passenger.
"""

        explanation = ask_llm(prompt)

        return {
            "intent": "ticket_prediction",
            "ticket_prediction": result,
            "assistant_response": explanation
        }

    # ---------------- DEFAULT LLM RESPONSE ----------------
    return {
        "intent": "general_query",
        "assistant_response": ask_llm(query)
    }
print("ENDPOINTS LOADED")