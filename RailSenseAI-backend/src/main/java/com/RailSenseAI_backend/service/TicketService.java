package com.RailSenseAI_backend.service;

import com.RailSenseAI_backend.entity.Station;
import com.RailSenseAI_backend.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class TicketService {

    @Autowired
    private StationRepository stationRepo;

    /**
     * Objective 5 & 8: Passenger Travel Intelligence System
     * Combines Waitlist Probability with Real-time Network Status.
     */
    public Map<String, Object> getConfirmationOdds(String trainNo, int currentWL, String destinationCode) {
        // 1. Demand Modeling (Objective 5)
        int daysUntilDeparture = 15; // Placeholder for booking window

        // Base probability calculation based on WL number and time buffer
        double baseProb = 100.0 - (currentWL * 1.5);
        double timeBonus = daysUntilDeparture * 1.2;
        double finalProbability = Math.min(99.0, Math.max(5.0, baseProb + (timeBonus / 2)));

        // 2. Network Awareness (Connecting Induced Delays)
        // Checks if the destination station is currently reporting disruptions (Part 2 & 3)
        // 2. Network Awareness (Connecting Induced Delays) [cite: 23, 26]
        // findById is used because stationCode is the @Id in our Neo4j Station entity
        String areaStatus = stationRepo.findById(destinationCode)
                .map(Station::getStatus)
                .orElse("CLEAR");

        Map<String, Object> response = new HashMap<>();
        response.put("trainNo", trainNo);
        response.put("currentWL", currentWL);
        response.put("confirmationProbability", String.format("%.2f%%", finalProbability));
        response.put("destinationStatus", areaStatus);

        // 3. Smart Booking Guidance (Objective 8)
        // Personalized guidance driven by live network analytics
        String advice;
        if (finalProbability > 70) {
            if ("CLEAR".equals(areaStatus)) {
                advice = "High confirmation chance and clear route. Safe to book.";
            } else {
                // Critical Insight: Seat might confirm, but travel will be difficult
                advice = "Seat likely to confirm, but destination " + destinationCode +
                        " is currently experiencing cascading delays. Expect disruptions upon arrival.";
            }
        } else if (finalProbability > 40) {
            advice = "Moderate risk. Confirmation uncertain; monitor network congestion hotspots at " + destinationCode + ".";
        } else {
            // Suggesting alternatives when reliability is low
            advice = "Low confirmation probability. System recommends searching for alternative routes via more resilient nodes.";
        }

        response.put("travelAdvice", advice);
        return response;
    }
}