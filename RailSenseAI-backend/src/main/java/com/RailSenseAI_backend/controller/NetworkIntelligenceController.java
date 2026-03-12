package com.RailSenseAI_backend.controller;

import com.RailSenseAI_backend.entity.Station;
import com.RailSenseAI_backend.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/ai-intelligence")
@CrossOrigin(origins = "*") // Allows your FastAPI teammate to call this easily
public class NetworkIntelligenceController {

    @Autowired
    private StationRepository stationRepo;

    /**
     * Objective 9: Provides structured graph data for the SLM/LLM Assistant.
     * The Python backend will call this to perform RAG (Retrieval-Augmented Generation).
     */
    @GetMapping("/graph-context")
    public ResponseEntity<List<Map<String, Object>>> getGraphContextForAI() {
        return ResponseEntity.ok(stationRepo.findAll().stream().map(station -> {
            return Map.of(
                    "station", station.getStationCode(),
                    "status", station.getStatus(),
                    "connectivityCount", station.getConnections().size(),
                    "neighbors", station.getConnections().stream()
                            .map(c -> c.getTargetStation().getStationCode())
                            .collect(Collectors.toList())
            );
        }).collect(Collectors.toList()));
    }
}