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
     * Objective 5 & 8: Smart Booking Guidance & Ticket Confirmation Prediction
     * Predicts confirmation probability and recommends optimal booking windows.
     */
    public Map<String, Object> getConfirmationOdds(String trainNo, int currentWL, String destinationCode) {
        // 1. Demand Modeling [cite: 43, 49]
        // Mocking days until departure; in production, this would come from the PNR/Schedule
        int daysUntilDeparture = 15;

        // Base probability calculation based on WL number [cite: 50, 55]
        double baseProb = 100.0 - (currentWL * 1.5);
        double timeBonus = daysUntilDeparture * 1.2;
        double finalProbability = Math.min(99.0, Math.max(5.0, baseProb + (timeBonus / 2)));

        // 2. Network Awareness (Infrastructure & Operational Layer) [cite: 11, 26]
        String areaStatus = stationRepo.findById(destinationCode)
                .map(Station::getStatus)
                .orElse("CLEAR");

        // 3. Smart Booking Recommendation (GAP FIX)
        // Algorithm: Higher WL + High-Demand Corridors = Earlier Booking Required
        int recommendedDays = calculateIdealBookingWindow(currentWL, destinationCode);

        Map<String, Object> response = new HashMap<>();
        response.put("trainNo", trainNo);
        response.put("currentWL", currentWL);
        response.put("confirmationProbability", String.format("%.2f%%", finalProbability));
        response.put("destinationStatus", areaStatus);
        response.put("recommendedAdvanceBookingDays", recommendedDays); // New required field [cite: 56]

        // 4. Passenger Intelligence Guidance [cite: 78, 106]
        String advice = generateSmartAdvice(finalProbability, areaStatus, destinationCode, recommendedDays);
        response.put("travelAdvice", advice);

        return response;
    }

    /**
     * Logic to recommend how many days in advance to book
     */
    private int calculateIdealBookingWindow(int wl, String code) {
        // Base window is 30 days
        int window = 30;
        // Increase window based on waitlist severity
        if (wl > 50) window += 15;
        if (wl > 100) window += 30;
        // High-impact hubs (like BPL) require even more lead time [cite: 59, 61]
        if ("BPL".equals(code) || "NDLS".equals(code)) window += 10;

        return window;
    }

    private String generateSmartAdvice(double prob, String status, String code, int days) {
        if (prob > 70) {
            return "CLEAR".equals(status)
                    ? "High confirmation chance. Safe to book. For future trips on this route, book " + days + " days in advance."
                    : "Seat likely to confirm, but " + code + " has cascading delays. Expect disruptions[cite: 24, 110].";
        } else if (prob > 40) {
            return "Moderate risk. We recommend booking " + days + " days in advance to secure a 'Confirmed' status[cite: 56].";
        } else {
            return "Low probability. System recommends alternative routes or booking at least " + (days + 20) + " days earlier[cite: 57, 82].";
        }
    }
}