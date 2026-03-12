package com.RailSenseAI_backend.controller;

import com.RailSenseAI_backend.dto.SimulationRequest;
import com.RailSenseAI_backend.entity.NetworkLog;
import com.RailSenseAI_backend.repository.NetworkLogRepository;
import com.RailSenseAI_backend.service.*;
import com.RailSenseAI_backend.service.CrowdIntelliegenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rail-intelligence")
@CrossOrigin(origins = "http://localhost:5173")
public class NetworkController {

    @Autowired
    private RailwayService railwayService;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private CongestionService congestionService;

    @Autowired
    private CrowdIntelliegenceService crowdService;

    @Autowired
    private NetworkLogRepository logRepo;

    /**
     * Objective 10: Interactive Dashboard Topology Feed
     */
    @GetMapping("/dashboard/topology")
    public ResponseEntity<Map<String, Object>> getTopology() {
        return ResponseEntity.ok(railwayService.getNetworkTopology());
    }

    /**
     * Objective 2 & 3: Run Cascading Delay Simulation
     */
    @PostMapping("/simulate/cascade")
    public ResponseEntity<List<String>> runCascadeSimulation(@RequestBody SimulationRequest request) {
        List<String> affected = railwayService.predictDelayCascade(
                request.getStationCode(),
                request.getDelayMinutes()
        );
        return ResponseEntity.ok(affected);
    }

    /**
     * View the last 10 simulation events
     */
    @GetMapping("/simulation/history")
    public ResponseEntity<List<NetworkLog>> getSimulationHistory() {
        return ResponseEntity.ok(logRepo.findTop10ByOrderByTimestampDesc());
    }

    /**
     * Objective 6 & 7: Infrastructure Vulnerability & Intelligent Routing
     * Updated to use the integrated analyzeNetworkResilience method.
     */
    @GetMapping("/analytics/resilience-report")
    public ResponseEntity<Map<String, Object>> getResilienceReport(
            @RequestParam(defaultValue = "NDLS") String sourceCode,
            @RequestParam(defaultValue = "MAS") String targetCode) {

        // The logic is now merged in the Service layer to handle both Hub Analysis and Rerouting
        Map<String, Object> report = railwayService.analyzeNetworkResilience(sourceCode, targetCode);

        return ResponseEntity.ok(report);
    }

    /**
     * Objective 9: System snapshot for AI/SLM processing
     */
    @GetMapping("/ai/assistant-feed")
    public ResponseEntity<String> getAiAssistantData() {
        return ResponseEntity.ok(railwayService.getSystemSnapshotForAI());
    }

    /**
     * Objective 10: Operational Reset
     */
    @PostMapping("/simulation/reset")
    public ResponseEntity<String> resetSimulation() {
        railwayService.resetNetwork();
        return ResponseEntity.ok("Operational Reset: Network status reset to CLEAR for all stations.");
    }

    /**
     * Objective 8: Identify Congestion Hotspots
     */
    @GetMapping("/analytics/congestion-hotspots")
    public ResponseEntity<List<Map<String, Object>>> getHotspots() {
        return ResponseEntity.ok(congestionService.identifyCongestionHotspots());
    }

    /**
     * Analyze crowd levels at a specific station
     */
    @GetMapping("/analytics/crowd-levels/{stationCode}")
    public ResponseEntity<Map<String, Object>> getCrowdLevels(@PathVariable String stationCode) {
        return ResponseEntity.ok(crowdService.getCrowdInsight(stationCode));
    }

    /**
     * Passenger Utility: Check WL confirmation probability
     */
    @GetMapping("/passenger/ticket-odds")
    public ResponseEntity<Map<String, Object>> checkTicket(
            @RequestParam String trainNo,
            @RequestParam int wl,
            @RequestParam String stationCode) {
        return ResponseEntity.ok(ticketService.getConfirmationOdds(trainNo, wl, stationCode));
    }
}