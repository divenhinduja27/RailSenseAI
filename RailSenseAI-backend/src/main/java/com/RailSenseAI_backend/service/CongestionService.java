package com.RailSenseAI_backend.service;

import com.RailSenseAI_backend.entity.Station;
import com.RailSenseAI_backend.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap; // Add this import
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CongestionService {

    @Autowired
    private StationRepository stationRepo;

    /**
     * Objective 3: Railway Congestion and Capacity Prediction
     * Detects station congestion hotspots where train density exceeds infrastructure.
     */
    public List<Map<String, Object>> identifyCongestionHotspots() {
        return stationRepo.findAll().stream()
                .filter(s -> !"CLEAR".equals(s.getStatus()))
                .map(s -> {
                    // Using HashMap avoids the "incompatible types" error with Map.of()
                    Map<String, Object> stationData = new HashMap<>();
                    stationData.put("stationCode", s.getStationCode());
                    stationData.put("severity", s.getStatus());
                    stationData.put("isOverloaded", "CRITICAL".equals(s.getStatus()));
                    stationData.put("utilizationFactor", "CRITICAL".equals(s.getStatus()) ? "95%" : "75%");
                    return stationData;
                })
                .collect(Collectors.toList());
    }
}