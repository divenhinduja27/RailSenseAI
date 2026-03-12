import pandas as pd
import networkx as nx
import folium
import random

# ---------------- LOAD DATA ----------------

stations = pd.read_csv("../data/stations.csv")
routes = pd.read_csv("../data/routes.csv")

# ---------------- CREATE GRAPH ----------------

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

# ---------------- CREATE MAP ----------------

rail_map = folium.Map(location=[22.5, 78.9], zoom_start=5)

# ---------------- ADD STATIONS ----------------

for node in G.nodes(data=True):

    folium.CircleMarker(
        location=[node[1]["lat"], node[1]["lon"]],
        radius=5,
        popup=f"{node[0]} - {node[1]['name']}",
        color="blue",
        fill=True
    ).add_to(rail_map)

# ---------------- ADD ROUTES ----------------

for edge in G.edges():

    s1 = G.nodes[edge[0]]
    s2 = G.nodes[edge[1]]

    folium.PolyLine(
        locations=[
            [s1["lat"], s1["lon"]],
            [s2["lat"], s2["lon"]]
        ],
        color="red",
        weight=2
    ).add_to(rail_map)

# ---------------- SAVE MAP ----------------

rail_map.save("railway_network_map.html")

print("Map created: railway_network_map.html")