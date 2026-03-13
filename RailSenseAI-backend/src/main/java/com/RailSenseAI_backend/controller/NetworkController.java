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
@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")
public class NetworkController {

    @Autowired
    private RailwayService railwayService;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private CongestionService congestionService;

    @Autowired
    private CrowdIntelligenceService crowdService;

    @Autowired
    private AiAssistantService aiAssistantService;

    @Autowired
    private NetworkLogRepository logRepo;


    // ---------------- DASHBOARD TOPOLOGY ----------------

    @GetMapping("/dashboard/topology")
    public ResponseEntity<Map<String, Object>> getTopology() {
        return ResponseEntity.ok(railwayService.getNetworkTopology());
    }


    // ---------------- DELAY CASCADE (AI ENGINE) ----------------

    @PostMapping("/simulate/cascade")
    public ResponseEntity<Object> runCascadeSimulation(@RequestBody SimulationRequest request) {

        return ResponseEntity.ok(
                aiAssistantService.getDelayImpact(request.getStationCode())
        );
    }


    // ---------------- SIMULATION HISTORY ----------------

    @GetMapping("/simulation/history")
    public ResponseEntity<List<NetworkLog>> getSimulationHistory() {
        return ResponseEntity.ok(logRepo.findTop10ByOrderByTimestampDesc());
    }


    // ---------------- NETWORK RESILIENCE (AI GRAPH ANALYSIS) ----------------

    @GetMapping("/analytics/resilience-report")
    public ResponseEntity<Object> getResilienceReport(
            @RequestParam(defaultValue = "NDLS") String sourceCode,
            @RequestParam(defaultValue = "MAS") String targetCode) {

        return ResponseEntity.ok(
                aiAssistantService.getCriticalStations()
        );
    }


    // ---------------- PASSENGER ROUTE PLANNER (AI ROUTING) ----------------

    @GetMapping("/passenger/route-planner")
    public ResponseEntity<Object> getPassengerRoute(
            @RequestParam String sourceCode,
            @RequestParam String targetCode) {

        return ResponseEntity.ok(
                aiAssistantService.getSmartRoute(sourceCode, targetCode)
        );
    }


    // ---------------- AI CHAT ----------------

    @PostMapping("/ai/chat")
    public ResponseEntity<Map<String, String>> chatWithAI(
            @RequestBody Map<String, String> payload) {

        String userQuery = payload.get("query");

        String response = aiAssistantService.processAiQuery(userQuery);

        return ResponseEntity.ok(Map.of("response", response));
    }


    // ---------------- CONGESTION ANALYSIS (AI DEMAND MODEL) ----------------

    @GetMapping("/analytics/congestion-hotspots")
    public ResponseEntity<Object> getHotspots(
            @RequestParam(defaultValue = "NDLS") String station) {

        return ResponseEntity.ok(
                aiAssistantService.getStationDemand(station)
        );
    }


    // ---------------- CROWD LEVEL ----------------

    @GetMapping("/analytics/crowd-levels/{stationCode}")
    public ResponseEntity<Map<String, Object>> getCrowdLevels(
            @PathVariable String stationCode) {

        return ResponseEntity.ok(
                crowdService.getCrowdInsight(stationCode)
        );
    }


    // ---------------- TICKET PREDICTION ----------------

    @GetMapping("/passenger/ticket-odds")
    public ResponseEntity<Map<String, Object>> checkTicket(
            @RequestParam String trainNo,
            @RequestParam int wl,
            @RequestParam String stationCode) {

        return ResponseEntity.ok(
                ticketService.getConfirmationOdds(trainNo, wl, stationCode)
        );
    }


    // ---------------- RESET NETWORK ----------------

    @PostMapping("/simulation/reset")
    public ResponseEntity<String> resetSimulation() {

        railwayService.resetNetwork();

        return ResponseEntity.ok(
                "Operational Reset: Network status reset to CLEAR for all stations."
        );
    }
}