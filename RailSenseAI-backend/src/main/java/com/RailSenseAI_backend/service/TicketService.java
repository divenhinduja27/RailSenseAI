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
     * Objective 5 & 8: Passenger Travel Intelligence System [cite: 47, 78]
     * Combines Waitlist Probability with Real-time Network Status.
     */
    public Map<String, Object> getConfirmationOdds(String trainNo, int currentWL, String destinationCode) {
        // 1. Demand Modeling (Objective 5) [cite: 49, 50]
        int daysUntilDeparture = 15; // Placeholder for booking window [cite: 56]

        // Base probability calculation based on WL number and time buffer [cite: 51]
        double baseProb = 100.0 - (currentWL * 1.5);
        double timeBonus = daysUntilDeparture * 1.2;
        double finalProbability = Math.min(99.0, Math.max(5.0, baseProb + (timeBonus / 2)));

        // 2. Network Awareness (Connecting Induced Delays) [cite: 23, 114]
        // This checks if the user's destination is currently CONGESTED via your Postman action
        String areaStatus = stationRepo.findByStationCode(destinationCode)
                .map(Station::getStatus)
                .orElse("CLEAR");

        Map<String, Object> response = new HashMap<>();
        response.put("trainNo", trainNo);
        response.put("currentWL", currentWL);
        response.put("confirmationProbability", String.format("%.2f%%", finalProbability));
        response.put("destinationStatus", areaStatus);

        // 3. Smart Booking Guidance (Objective 8) [cite: 83, 106]
        // Generates personalized guidance based on network analytics [cite: 106]
        String advice;
        if (finalProbability > 70) {
            advice = areaStatus.equals("CLEAR")
                    ? "High confirmation chance and clear route. Safe to book." // [cite: 55]
                    : "Seat likely, but route is currently experiencing cascading delays. Expect disruptions."; // [cite: 27]
        } else if (finalProbability > 40) {
            advice = "Moderate risk. Confirmation uncertain; monitor network congestion hotspots."; // [cite: 36, 51]
        } else {
            // Suggesting alternatives when confirmation or reliability is low [cite: 57, 82]
            advice = "Low confirmation probability. Highly recommend searching for alternative routes."; // [cite: 57, 82]
        }

        response.put("travelAdvice", advice);
        return response;
    }
}