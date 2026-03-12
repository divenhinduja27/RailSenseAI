package com.RailSenseAI_backend.controller;

import com.RailSenseAI_backend.dto.SimulationRequest;
import com.RailSenseAI_backend.entity.NetworkLog;
import com.RailSenseAI_backend.repository.NetworkLogRepository;
import com.RailSenseAI_backend.service.RailwayService;
import com.RailSenseAI_backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rail-intelligence")
public class NetworkController {

    @Autowired
    private RailwayService railwayService;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private NetworkLogRepository logRepo;

    // Objective 10: Interactive system visualizing network topology [cite: 108, 126]
    @GetMapping("/dashboard/topology")
    public ResponseEntity<Map<String, Object>> getTopology() {
        return ResponseEntity.ok(railwayService.getNetworkTopology());
    }

    // Objective 2: Predicting delay propagation across connected stations [cite: 26, 119]
    @PostMapping("/simulate/cascade")
    public ResponseEntity<List<String>> runCascadeSimulation(@RequestBody SimulationRequest request) {
        List<String> affected = railwayService.predictDelayCascade(
                request.getStationCode(),
                request.getDelayMinutes()
        );
        return ResponseEntity.ok(affected);
    }

    // Objective 1: Historical Data Analysis for temporal graphs [cite: 18, 123]
    @GetMapping("/simulation/history")
    public ResponseEntity<List<NetworkLog>> getSimulationHistory() {
        return ResponseEntity.ok(logRepo.findTop10ByOrderByTimestampDesc());
    }

    // Objective 6 & 7: Analyzing critical nodes and suggesting alternative routes [cite: 60, 72]
    @GetMapping("/analytics/resilience-report")
    public ResponseEntity<Map<String, Object>> getResilienceReport(@RequestParam(required = false) String targetCode) {
        Map<String, Object> report = railwayService.analyzeNetworkResilience();

        if (targetCode != null) {
            report.put("alternativeRoutes", railwayService.suggestAlternativeRoutes(targetCode));
        }

        return ResponseEntity.ok(report);
    }

    // Objective 9: Providing natural language insights for the SLM assistant [cite: 87, 91]
    @GetMapping("/ai/assistant-feed")
    public ResponseEntity<String> getAiAssistantData() {
        return ResponseEntity.ok(railwayService.getSystemSnapshotForAI());
    }

    // Objective 10: Operational reset for dynamic network exploration [cite: 114]
    @PostMapping("/simulation/reset")
    public ResponseEntity<String> resetSimulation() {
        railwayService.resetNetwork();
        return ResponseEntity.ok("Network status reset to CLEAR for all stations.");
    }

    // Objective 5 & 8: Predicting ticket confirmation with network intelligence [cite: 50, 78, 122]
    @GetMapping("/passenger/ticket-odds")
    public ResponseEntity<Map<String, Object>> checkTicket(
            @RequestParam String trainNo,
            @RequestParam int wl,
            @RequestParam String stationCode) { // Added stationCode to link delay status
        return ResponseEntity.ok(ticketService.getConfirmationOdds(trainNo, wl, stationCode));
    }
}