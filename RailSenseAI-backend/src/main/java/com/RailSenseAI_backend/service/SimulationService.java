package com.RailSenseAI_backend.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SimulationService {

    private final Map<String, Integer> dynamicLoad = new ConcurrentHashMap<>();

    public String checkCapacityConflict(String stationCode, int maxCapacity) {

        int currentLoad = dynamicLoad.getOrDefault(stationCode, 0);

        if (currentLoad >= maxCapacity) {
            return "CONFLICT: Capacity exceeded at " + stationCode;
        }

        return "STABLE";
    }


    public double calculateDemandMultiplier(String season) {

        if (season == null) return 1.0;

        return switch (season.toUpperCase()) {

            case "HOLIDAY" -> 1.5;

            case "MONSOON" -> 0.8;

            default -> 1.0;
        };
    }
}