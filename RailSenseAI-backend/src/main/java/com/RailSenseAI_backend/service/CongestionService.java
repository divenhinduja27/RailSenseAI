package com.RailSenseAI_backend.service;

import com.RailSenseAI_backend.entity.Station;
import com.RailSenseAI_backend.repository.StationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CongestionService {

    @Autowired
    private StationRepository stationRepo;

    /**
     * Identifies congestion hotspots.
     * For demo purposes we return all stations and compute congestion metrics.
     */
    public List<Map<String, Object>> identifyCongestionHotspots() {

        return stationRepo.findAll().stream()

                .map(s -> {

                    Map<String, Object> stationData = new HashMap<>();

                    String status = s.getStatus() != null ? s.getStatus() : "CLEAR";

                    stationData.put("stationCode", s.getStationCode());
                    stationData.put("severity", status);

                    boolean isCritical = "CRITICAL_DELAY".equals(status);

                    stationData.put("isOverloaded", isCritical);

                    stationData.put(
                            "peakUtilizationHours",
                            List.of("08:00 - 11:00", "17:00 - 20:00")
                    );

                    stationData.put("seasonalRisk", "High (Festive Peak)");

                    stationData.put(
                            "utilizationFactor",
                            isCritical ? "98%" : "82%"
                    );

                    stationData.put("trackCapacityStatus", "At Capacity Limit");

                    return stationData;
                })

                .collect(Collectors.toList());
    }
}