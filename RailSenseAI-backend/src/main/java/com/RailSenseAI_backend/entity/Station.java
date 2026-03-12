package com.RailSenseAI_backend.entity;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Node("Station") // stations represent nodes
@Data
@NoArgsConstructor
public class Station {

    @Id
    private String stationCode; // unique identifier

    private String name;

    private Double latitude; // Needed for Dashboard/Map visualization [cite: 108]
    private Double longitude;

    // Status can be "CLEAR", "CONGESTED", or "CRITICAL_DELAY" [cite: 36, 119]
    private String status;

    // rail connections represent edges [cite: 16]
    @Relationship(type = "CONNECTED_TO", direction = Relationship.Direction.OUTGOING)
    private List<RouteConnection> connections = new ArrayList<>();

    // Custom Constructor to prevent NullPointerException in getConnections()
    public Station(String stationCode, String name, Double latitude, Double longitude, String status, List<RouteConnection> connections) {
        this.stationCode = stationCode;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.connections = (connections != null) ? connections : new ArrayList<>();
    }
}