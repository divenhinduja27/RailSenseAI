import pandas as pd
import json

# ---------------- LOAD STATIONS ----------------

with open("../raw-data/stations.json") as f:
    data = json.load(f)

features = data["features"]

stations = []

for station in features:
    prop = station.get("properties", {})
    geometry = station.get("geometry")

    if geometry is None:
        continue

    coord = geometry.get("coordinates")

    stations.append({
        "station_code": prop.get("code"),
        "station_name": prop.get("name"),
        "longitude": coord[0],
        "latitude": coord[1]
    })

stations_df = pd.DataFrame(stations)

important_stations = [
"CSTM","MMCT","PUNE","ADI","ST","RJT",
"NDLS","DLI","JP","LKO","ASR",
"NGP","BPL","JHS",
"MAS","SBC","HYB","SC","ERS",
"HWH","KOAA","BBS","PNBE","RNC",
"VSKP","TVC","MDU","GWL","KOTA","UJN","RTM","KYN"
]

stations_df = stations_df[
    stations_df["station_code"].isin(important_stations)
]

stations_df.to_csv("../data/stations.csv", index=False)

print("Stations Selected:", len(stations_df))


# ---------------- LOAD TRAIN SCHEDULE ----------------

with open("../raw-data/schedules.json") as f:
    schedules = json.load(f)

schedule_df = pd.DataFrame(schedules)

# sort stops properly
schedule_df = schedule_df.sort_values(by=["train_number", "id"])

routes = []

valid_stations = set(stations_df["station_code"])

for train, group in schedule_df.groupby("train_number"):

    station_list = group["station_code"].tolist()

    # keep only important stations
    filtered = [s for s in station_list if s in valid_stations]

    # connect them sequentially
    for i in range(len(filtered) - 1):

        routes.append({
            "source": filtered[i],
            "destination": filtered[i+1]
        })

routes_df = pd.DataFrame(routes).drop_duplicates()

print("Routes created:", len(routes_df))

routes_df.to_csv("../data/routes.csv", index=False)

print("Datasets created successfully")