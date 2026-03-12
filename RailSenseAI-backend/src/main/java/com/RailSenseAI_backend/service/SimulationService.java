package com.RailSenseAI_backend.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SimulationService {
    // Stores dynamic load for each station (StationCode -> TrainCount)
    private final Map<String, Integer> dynamicLoad = new ConcurrentHashMap<>();

    // Fulfills Objective 3: Track capacity conflicts [cite: 38]
    public String checkCapacityConflict(String stationCode, int maxCapacity) {
        int currentLoad = dynamicLoad.getOrDefault(stationCode, 0);
        if (currentLoad >= maxCapacity) {
            return "CONFLICT: Capacity exceeded at " + stationCode;
        }
        return "STABLE";
    }

    // Fulfills Objective 4: Seasonal/Peak Travel Patterns [cite: 44]
    public double calculateDemandMultiplier(String season) {
        return switch (season.toUpperCase()) {
            case "HOLIDAY" -> 1.5; // 50% increase in demand [cite: 44]
            case "MONSOON" -> 0.8; // Lower demand due to disruptions
            default -> 1.0;
        };
    }
}