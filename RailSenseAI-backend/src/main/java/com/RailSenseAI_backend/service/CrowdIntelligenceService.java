package com.RailSenseAI_backend.service;

import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class CrowdIntelligenceService {

    /**
     * Passenger Flow Modeling and Crowd Intelligence
     */
    public Map<String, Object> getCrowdInsight(String stationCode) {

        Map<String, Object> insight = new HashMap<>();

        int currentHour = LocalTime.now().getHour();

        boolean isPeakHour = (currentHour >= 17 && currentHour <= 20);

        insight.put("stationCode", stationCode);

        insight.put("passengerDemand",
                isPeakHour ? "EXTREME" : "MODERATE");

        insight.put("transferCongestionRisk",
                isPeakHour ? "HIGH" : "LOW");

        insight.put("recommendedAction",
                isPeakHour ? "Increase platform security"
                        : "Standard operations");

        insight.put("timestamp", LocalTime.now().toString());

        return insight;
    }
}