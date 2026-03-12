package com.RailSenseAI_backend.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class CrowdIntelliegenceService {

    /**
     * Objective 4: Passenger Flow Modeling and Crowd Intelligence
     * Analyzes crowding levels at major stations and junctions[cite: 45].
     */
    public Map<String, Object> getCrowdInsight(String stationCode) {
        Map<String, Object> insight = new HashMap<>();

        // Logic: Cross-reference seasonal peak travel patterns [cite: 44]
        // Mock data representing predicted crowd levels based on incoming delayed trains
        int currentHour = 14;
        boolean isPeakHour = (currentHour >= 17 && currentHour <= 20); // [cite: 39]

        insight.put("stationCode", stationCode);
        insight.put("passengerDemand", isPeakHour ? "EXTREME" : "MODERATE"); //
        insight.put("transferCongestionRisk", isPeakHour ? "HIGH" : "LOW"); // [cite: 45]
        insight.put("recommendedAction", isPeakHour ? "Increase platform security" : "Standard operations");

        return insight;
    }
}