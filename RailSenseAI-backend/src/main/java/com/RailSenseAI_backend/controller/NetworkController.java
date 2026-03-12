package com.RailSenseAI_backend.controller;

import com.RailSenseAI_backend.dto.SimulationRequest;
import com.RailSenseAI_backend.entity.NetworkLog;
import com.RailSenseAI_backend.repository.NetworkLogRepository;
import com.RailSenseAI_backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rail-intelligence")
// 🚀 FIX: Swapped 'origins' for 'originPatterns' to satisfy Spring Security
@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")
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
    private AiAssistantService aiAssistantService;

    @Autowired
    private NetworkLogRepository logRepo;

    @GetMapping("/dashboard/topology")
    public ResponseEntity<Map<String, Object>> getTopology() {
        return ResponseEntity.ok(railwayService.getNetworkTopology());
    }

    @PostMapping("/simulate/cascade")
    public ResponseEntity<List<String>> runCascadeSimulation(@RequestBody SimulationRequest request) {
        List<String> affected = railwayService.predictDelayCascade(
                request.getStationCode(),
                request.getDelayMinutes()
        );
        return ResponseEntity.ok(affected);
    }

    @GetMapping("/simulation/history")
    public ResponseEntity<List<NetworkLog>> getSimulationHistory() {
        return ResponseEntity.ok(logRepo.findTop10ByOrderByTimestampDesc());
    }

    @GetMapping("/analytics/resilience-report")
    public ResponseEntity<Map<String, Object>> getResilienceReport(
            @RequestParam(defaultValue = "NDLS") String sourceCode,
            @RequestParam(defaultValue = "MAS") String targetCode) {
        return ResponseEntity.ok(railwayService.analyzeNetworkResilience(sourceCode, targetCode));
    }

    @GetMapping("/passenger/route-planner")
    public ResponseEntity<Map<String, Object>> getPassengerRoute(
            @RequestParam String sourceCode,
            @RequestParam String targetCode) {
        Map<String, Object> report = railwayService.analyzeNetworkResilience(sourceCode, targetCode);
        report.put("intelligenceSource", "Passenger Smart-Routing Layer");
        return ResponseEntity.ok(report);
    }

    @PostMapping("/ai/chat")
    public ResponseEntity<Map<String, String>> chatWithAI(@RequestBody Map<String, String> payload) {
        String userQuery = payload.get("query");
        String response = aiAssistantService.processAiQuery(userQuery);
        return ResponseEntity.ok(Map.of("response", response));
    }

    @GetMapping("/analytics/congestion-hotspots")
    public ResponseEntity<List<Map<String, Object>>> getHotspots() {
        return ResponseEntity.ok(congestionService.identifyCongestionHotspots());
    }

    @GetMapping("/analytics/crowd-levels/{stationCode}")
    public ResponseEntity<Map<String, Object>> getCrowdLevels(@PathVariable String stationCode) {
        return ResponseEntity.ok(crowdService.getCrowdInsight(stationCode));
    }

    @GetMapping("/passenger/ticket-odds")
    public ResponseEntity<Map<String, Object>> checkTicket(
            @RequestParam String trainNo,
            @RequestParam int wl,
            @RequestParam String stationCode) {
        return ResponseEntity.ok(ticketService.getConfirmationOdds(trainNo, wl, stationCode));
    }

    @PostMapping("/simulation/reset")
    public ResponseEntity<String> resetSimulation() {
        railwayService.resetNetwork();
        return ResponseEntity.ok("Operational Reset: Network status reset to CLEAR for all stations.");
    }
}