package com.RailSenseAI_backend.entity;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import java.time.LocalDateTime;

@Node("NetworkLog")
public class NetworkLog {

    @Id
    @GeneratedValue
    private Long id;

    private String triggerStation;
    private String affectedStation;
    private Integer delayMinutes;
    private LocalDateTime timestamp;

    public NetworkLog() {}

    public NetworkLog(Long id, String triggerStation, String affectedStation,
                      Integer delayMinutes, LocalDateTime timestamp) {
        this.id = id;
        this.triggerStation = triggerStation;
        this.affectedStation = affectedStation;
        this.delayMinutes = delayMinutes;
        this.timestamp = timestamp;
    }

    // -------- GETTERS --------

    public Long getId() {
        return id;
    }

    public String getTriggerStation() {
        return triggerStation;
    }

    public String getAffectedStation() {
        return affectedStation;
    }

    public Integer getDelayMinutes() {
        return delayMinutes;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    // -------- SETTERS --------

    public void setId(Long id) {
        this.id = id;
    }

    public void setTriggerStation(String triggerStation) {
        this.triggerStation = triggerStation;
    }

    public void setAffectedStation(String affectedStation) {
        this.affectedStation = affectedStation;
    }

    public void setDelayMinutes(Integer delayMinutes) {
        this.delayMinutes = delayMinutes;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}