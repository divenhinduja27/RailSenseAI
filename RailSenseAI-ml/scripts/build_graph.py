import pandas as pd
import networkx as nx
import random

# ---------------- LOAD DATA ----------------

stations = pd.read_csv("../data/stations.csv")
routes = pd.read_csv("../data/routes.csv")

print("Stations:", len(stations))
print("Routes:", len(routes))

# ---------------- CREATE GRAPH ----------------

G = nx.Graph()

# Add stations as nodes
for _, row in stations.iterrows():
    G.add_node(
        row["station_code"],
        name=row["station_name"],
        lat=row["latitude"],
        lon=row["longitude"]
    )

# Add routes as edges with random distance
for _, row in routes.iterrows():

    distance = random.randint(200, 1200)

    G.add_edge(
        row["source"],
        row["destination"],
        distance=distance
    )

print("\nGraph created")
print("Total stations:", G.number_of_nodes())
print("Total routes:", G.number_of_edges())


# ---------------- GRAPH TEST ----------------

print("\nNeighbors of PUNE:")
print(list(G.neighbors("PUNE")))

# ---------------- ROUTE FUNCTIONS ----------------

def find_route(source, destination):
    """
    Find shortest path based on distance
    """
    try:
        path = nx.shortest_path(G, source, destination, weight="distance")
        return path
    except nx.NetworkXNoPath:
        return None


def route_distance(path):
    """
    Calculate total route distance
    """
    total = 0

    for i in range(len(path) - 1):
        total += G[path[i]][path[i + 1]]["distance"]

    return total


def alternative_routes(source, destination, k=3):
    """
    Get top K alternative routes
    """
    try:
        paths = list(nx.shortest_simple_paths(G, source, destination, weight="distance"))
        return paths[:k]
    except:
        return []


# ---------------- TEST ROUTE ----------------

source = "CSTM"
destination = "NDLS"

route = find_route(source, destination)

print("\nBest Route:")
print(route)

if route:
    print("Total Distance:", route_distance(route), "km")

# ---------------- ALTERNATIVE ROUTES ----------------

print("\nAlternative Routes:")

alt = alternative_routes(source, destination)

for i, r in enumerate(alt):
    print("Route", i + 1, ":", r, "| Distance:", route_distance(r), "km")


