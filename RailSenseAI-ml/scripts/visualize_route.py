import pandas as pd
import networkx as nx
import folium
import random
import requests
import sys

# ---------------- USER INPUT ----------------

# default values
source = "KYN"
destination = "NDLS"

# allow command line input
if len(sys.argv) == 3:
    source = sys.argv[1]
    destination = sys.argv[2]

print(f"Finding route: {source} → {destination}")

# ---------------- LOAD DATA ----------------

stations = pd.read_csv("../data/stations.csv")
routes = pd.read_csv("../data/routes.csv")

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

    distance = random.randint(200, 1200)

    G.add_edge(
        row["source"],
        row["destination"],
        distance=distance
    )

# ---------------- GET ROUTE FROM API ----------------

try:
    response = requests.get(
        "http://127.0.0.1:8000/smart-route",
        params={"source": source, "destination": destination}
    )

    response.raise_for_status()

    data = response.json()
    route = data["route"]

    print("Route returned by API:", route)

except Exception as e:
    print("API error:", e)
    exit()

# ---------------- CREATE MAP ----------------

rail_map = folium.Map(location=[22.5, 78.9], zoom_start=5)

# ---------------- DRAW STATIONS ----------------

for node in G.nodes(data=True):

    folium.CircleMarker(
        location=[node[1]["lat"], node[1]["lon"]],
        radius=5,
        popup=node[0],
        color="blue",
        fill=True
    ).add_to(rail_map)

# ---------------- DRAW ALL ROUTES ----------------

for edge in G.edges():

    s1 = G.nodes[edge[0]]
    s2 = G.nodes[edge[1]]

    folium.PolyLine(
        locations=[[s1["lat"], s1["lon"]], [s2["lat"], s2["lon"]]],
        color="gray",
        weight=1
    ).add_to(rail_map)

# ---------------- HIGHLIGHT BEST ROUTE ----------------

for i in range(len(route) - 1):

    s1 = G.nodes[route[i]]
    s2 = G.nodes[route[i + 1]]

    folium.PolyLine(
        locations=[[s1["lat"], s1["lon"]], [s2["lat"], s2["lon"]]],
        color="green",
        weight=5
    ).add_to(rail_map)

# ---------------- SAVE MAP ----------------

output_file = f"smart_route_{source}_{destination}.html"
rail_map.save(output_file)

print(f"Map saved as {output_file}")