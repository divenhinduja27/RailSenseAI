package com.RailSenseAI_backend.entity;

import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@RelationshipProperties
public class RouteConnection {

    @RelationshipId
    private Long id;

    @TargetNode
    private Station targetStation;

    private Integer distance;

    private Integer delayMinutes;

    public RouteConnection() {
    }

    public RouteConnection(Station targetStation, Integer distance, Integer delayMinutes) {
        this.targetStation = targetStation;
        this.distance = distance;
        this.delayMinutes = delayMinutes;
    }

    public Long getId() {
        return id;
    }

    public Station getTargetStation() {
        return targetStation;
    }

    public Integer getDistance() {
        return distance;
    }

    public Integer getDelayMinutes() {
        return delayMinutes;
    }

    public void setDelayMinutes(Integer delayMinutes) {
        this.delayMinutes = delayMinutes;
    }

    public void setDistance(Integer distance) {
        this.distance = distance;
    }

    public void setTargetStation(Station targetStation) {
        this.targetStation = targetStation;
    }
}