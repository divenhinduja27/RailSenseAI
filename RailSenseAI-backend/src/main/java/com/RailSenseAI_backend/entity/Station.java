package com.RailSenseAI_backend.entity;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.ArrayList;
import java.util.List;

@Node("Station")
public class Station {

    @Id
    private String stationCode;

    private String name;
    private Double latitude;
    private Double longitude;
    private String status;

    @Relationship(type = "CONNECTED_TO", direction = Relationship.Direction.OUTGOING)
    private List<RouteConnection> connections = new ArrayList<>();

    public Station() {}

    public Station(String stationCode, String name, Double latitude, Double longitude, String status) {
        this.stationCode = stationCode;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.connections = new ArrayList<>();
    }

    // ---------- Getters ----------

    public String getStationCode() {
        return stationCode;
    }

    public String getName() {
        return name;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public String getStatus() {
        return status;
    }

    public List<RouteConnection> getConnections() {
        return connections;
    }

    // ---------- Setters ----------

    public void setStationCode(String stationCode) {
        this.stationCode = stationCode;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setConnections(List<RouteConnection> connections) {
        this.connections = connections;
    }
}