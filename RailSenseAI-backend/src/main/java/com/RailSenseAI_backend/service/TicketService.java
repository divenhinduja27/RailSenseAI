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

    public Map<String, Object> getConfirmationOdds(String trainNo, int currentWL, String destinationCode) {

        int daysUntilDeparture = 15;

        double baseProb = 100.0 - (currentWL * 1.5);
        double timeBonus = daysUntilDeparture * 1.2;

        double finalProbability =
                Math.min(99.0, Math.max(5.0, baseProb + (timeBonus / 2)));

        String areaStatus =
                stationRepo.findById(destinationCode)
                        .map(Station::getStatus)
                        .orElse("CLEAR");

        int recommendedDays =
                calculateIdealBookingWindow(currentWL, destinationCode);

        Map<String, Object> response = new HashMap<>();

        response.put("trainNo", trainNo);
        response.put("currentWL", currentWL);
        response.put("confirmationProbability",
                String.format("%.2f%%", finalProbability));

        response.put("destinationStatus", areaStatus);
        response.put("recommendedAdvanceBookingDays", recommendedDays);

        String advice =
                generateSmartAdvice(
                        finalProbability,
                        areaStatus,
                        destinationCode,
                        recommendedDays
                );

        response.put("travelAdvice", advice);

        return response;
    }


    private int calculateIdealBookingWindow(int wl, String code) {

        int window = 30;

        if (wl > 50) window += 15;
        if (wl > 100) window += 30;

        if ("BPL".equals(code) || "NDLS".equals(code))
            window += 10;

        return window;
    }


    private String generateSmartAdvice(double prob, String status,
                                       String code, int days) {

        if (prob > 70) {

            if ("CLEAR".equals(status)) {

                return "High confirmation chance. Safe to book. "
                        + "For future trips on this route, book "
                        + days + " days in advance.";

            } else {

                return "Seat likely to confirm, but "
                        + code + " currently has network delays.";
            }

        } else if (prob > 40) {

            return "Moderate risk. We recommend booking "
                    + days
                    + " days in advance.";

        } else {

            return "Low probability. Consider alternate routes or "
                    + "book at least " + (days + 20)
                    + " days earlier.";
        }
    }
}