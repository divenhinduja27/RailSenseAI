package com.RailSenseAI_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class AiAssistantService {

    private final String AI_BASE_URL = "http://localhost:8001";
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends the user query to FastAPI AI service
     */
    public String processAiQuery(String userQuery) {

        String url = AI_BASE_URL + "/chat?query=" + userQuery.replace(" ", "%20");

        try {
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            return "AI Service error";
        }
    }

    /**
     * Smart Route Recommendation
     */
    public Object getSmartRoute(String source, String destination) {

        String url = UriComponentsBuilder
                .fromHttpUrl(AI_BASE_URL + "/smart-route")
                .queryParam("source", source)
                .queryParam("destination", destination)
                .toUriString();

        return restTemplate.getForObject(url, Object.class);
    }

    /**
     * Delay Cascade Impact
     */
    public Object getDelayImpact(String station) {

        String url = UriComponentsBuilder
                .fromHttpUrl(AI_BASE_URL + "/delay-impact")
                .queryParam("station", station)
                .toUriString();

        return restTemplate.getForObject(url, Object.class);
    }

    /**
     * Station Demand Analysis
     */
    public Object getStationDemand(String station) {

        String url = UriComponentsBuilder
                .fromHttpUrl(AI_BASE_URL + "/station-demand")
                .queryParam("station", station)
                .toUriString();

        return restTemplate.getForObject(url, Object.class);
    }

    /**
     * Critical Station Detection
     */
    public Object getCriticalStations() {

        return restTemplate.getForObject(
                AI_BASE_URL + "/critical-stations",
                Object.class
        );
    }
}