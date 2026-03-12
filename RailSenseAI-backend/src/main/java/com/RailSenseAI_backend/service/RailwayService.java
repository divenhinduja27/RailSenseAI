package com.RailSenseAI_backend.service;

import com.RailSenseAI_backend.entity.Station;
import com.RailSenseAI_backend.entity.Route;
import com.RailSenseAI_backend.entity.NetworkLog;
import com.RailSenseAI_backend.repository.NetworkLogRepository;
import com.RailSenseAI_backend.repository.StationRepository;
import com.RailSenseAI_backend.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RailwayService {

    @Autowired
    private StationRepository stationRepo;

    @Autowired
    private RouteRepository routeRepo;

    @Autowired
    private NetworkLogRepository logRepo;

    // Objective 10: Interactive Dashboard Topology Feed
    public Map<String, Object> getNetworkTopology() {
        Map<String, Object> response = new HashMap<>();
        response.put("nodes", stationRepo.findAll());
        response.put("edges", routeRepo.findAll());
        return response;
    }

    // Objective 2 & 3: Predict cascading disruptions with Severity Logic
    public List<String> predictDelayCascade(String startStationCode, int initialDelayMinutes) {
        List<String> affectedStations = new ArrayList<>();
        Queue<Map.Entry<String, Integer>> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();

        // Queue stores Pair of (StationCode, CurrentDelayAtThatStation)
        queue.add(new AbstractMap.SimpleEntry<>(startStationCode, initialDelayMinutes));
        visited.add(startStationCode);

        while (!queue.isEmpty()) {
            Map.Entry<String, Integer> currentEntry = queue.poll();
            String currentCode = currentEntry.getKey();
            int currentDelay = currentEntry.getValue();

            List<Route> connections = routeRepo.findBySourceCode(currentCode);

            for (Route route : connections) {
                if (!visited.contains(route.getTargetCode())) {

                    // SEVERITY LOGIC: 2 mins buffer recovery for every 100km traveled
                    int bufferRecovery = (int) (route.getDistance() / 100) * 2;
                    int propagatedDelay = Math.max(5, currentDelay - bufferRecovery);

                    stationRepo.findByStationCode(route.getTargetCode()).ifPresent(s -> {
                        // Mark status based on intensity
                        String status = propagatedDelay > 30 ? "CRITICAL_DELAY" : "CONGESTED";
                        s.setStatus(status);
                        stationRepo.save(s);

                        affectedStations.add(s.getName() + " (Est. Delay: " + propagatedDelay + "m)");

                        // Save to Temporal Log
                        NetworkLog log = new NetworkLog();
                        log.setTriggerStation(startStationCode);
                        log.setAffectedStation(s.getStationCode());
                        log.setDelayMinutes(propagatedDelay);
                        log.setTimestamp(LocalDateTime.now());
                        logRepo.save(log);
                    });

                    // Only continue the cascade if delay is still significant (>10 mins)
                    if (propagatedDelay > 10) {
                        queue.add(new AbstractMap.SimpleEntry<>(route.getTargetCode(), propagatedDelay));
                        visited.add(route.getTargetCode());
                    }
                }
            }
        }
        return affectedStations;
    }

    // Objective 6: Infrastructure Vulnerability & Network Resilience
    public Map<String, Object> analyzeNetworkResilience() {
        List<Station> stations = stationRepo.findAll();
        Station criticalNode = null;
        int maxImpact = -1;

        for (Station s : stations) {
            int impactScore = routeRepo.findBySourceCode(s.getStationCode()).size();
            if (impactScore > maxImpact) {
                maxImpact = impactScore;
                criticalNode = s;
            }
        }

        Map<String, Object> resilienceData = new HashMap<>();
        resilienceData.put("mostCriticalStation", criticalNode != null ? criticalNode.getName() : "N/A");
        resilienceData.put("impactFactor", maxImpact);
        resilienceData.put("vulnerabilityStatus", maxImpact > 2 ? "HIGH" : "MODERATE");
        return resilienceData;
    }

    // Objective 7: Intelligent Routing & Operational Optimization
    public List<String> suggestAlternativeRoutes(String targetStationCode) {
        return routeRepo.findAll().stream()
                .filter(route -> route.getTargetCode().equals(targetStationCode))
                .map(route -> "Alternative via " + route.getSourceCode() + " (Distance: " + route.getDistance() + "km)")
                .collect(Collectors.toList());
    }

    // Objective 4: Passenger Flow Modeling & Crowd Intelligence
    public Map<String, String> getCrowdIntelligenceReport() {
        Map<String, String> crowdReport = new HashMap<>();
        stationRepo.findAll().forEach(s -> {
            int load = routeRepo.findByTargetCode(s.getStationCode()).size() +
                    routeRepo.findBySourceCode(s.getStationCode()).size();
            String level = load > 2 ? "CRITICAL (Peak)" : (load > 1 ? "MODERATE" : "LOW");
            crowdReport.put(s.getName(), level);
        });
        return crowdReport;
    }

    // Objective 6: Network robustness modeling score
    public double calculateResilienceScore(String stationCode) {
        int totalNodes = (int) stationRepo.count();
        if (totalNodes == 0) return 1.0;
        int affectedNodes = predictDelayCascade(stationCode, 60).size();
        return 1.0 - ((double) affectedNodes / totalNodes);
    }

    // Objective 10: Operational Reset
    public void resetNetwork() {
        List<Station> allStations = stationRepo.findAll();
        for (Station s : allStations) {
            s.setStatus("CLEAR");
            stationRepo.save(s);
        }
    }

    // Objective 9: Lightweight AI Assistant (SLM) Integration
    public String getSystemSnapshotForAI() {
        long totalStations = stationRepo.count();
        long congestedStations = stationRepo.findAll().stream()
                .filter(s -> !"CLEAR".equals(s.getStatus())).count();

        Map<String, Object> resilience = analyzeNetworkResilience();

        return String.format(
                "RAILSENSE Operational Summary: %d/%d stations are currently reporting disruptions. " +
                        "Most vulnerable corridor hub: %s. Strategic Advice: Clear traffic flow toward %s to prevent network-wide gridlock.",
                congestedStations, totalStations, resilience.get("mostCriticalStation"), resilience.get("mostCriticalStation")
        );
    }
}