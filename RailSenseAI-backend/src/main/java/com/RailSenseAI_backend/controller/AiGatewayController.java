package com.RailSenseAI_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;




@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AiGatewayController {

    private final String FASTAPI_URL = "http://localhost:8001";
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * AI Chat Assistant
     */
    @GetMapping("/chat")
    public ResponseEntity<?> chat(@RequestParam String query) {

        String url = UriComponentsBuilder
                .fromHttpUrl(FASTAPI_URL + "/chat")
                .queryParam("query", query)
                .toUriString();

        Object response = restTemplate.getForObject(url, Object.class);
        return ResponseEntity.ok(response);
    }

    /**
     * Smart Route Recommendation
     */
    @GetMapping("/smart-route")
    public ResponseEntity<?> smartRoute(
            @RequestParam String source,
            @RequestParam String destination) {

        String url = UriComponentsBuilder
                .fromHttpUrl(FASTAPI_URL + "/smart-route")
                .queryParam("source", source)
                .queryParam("destination", destination)
                .toUriString();

        Object response = restTemplate.getForObject(url, Object.class);
        return ResponseEntity.ok(response);
    }

    /**
     * Delay Cascade Analysis
     */
    @GetMapping("/delay-impact")
    public ResponseEntity<?> delayImpact(@RequestParam String station) {

        String url = UriComponentsBuilder
                .fromHttpUrl(FASTAPI_URL + "/delay-impact")
                .queryParam("station", station)
                .toUriString();

        Object response = restTemplate.getForObject(url, Object.class);
        return ResponseEntity.ok(response);
    }

    /**
     * Passenger Demand Analysis
     */
    @GetMapping("/station-demand")
    public ResponseEntity<?> stationDemand(@RequestParam String station) {

        String url = UriComponentsBuilder
                .fromHttpUrl(FASTAPI_URL + "/station-demand")
                .queryParam("station", station)
                .toUriString();

        Object response = restTemplate.getForObject(url, Object.class);
        return ResponseEntity.ok(response);
    }

    /**
     * Critical Stations Detection
     */
    @GetMapping("/critical-stations")
    public ResponseEntity<?> criticalStations() {

        Object response = restTemplate.getForObject(
                FASTAPI_URL + "/critical-stations",
                Object.class
        );

        return ResponseEntity.ok(response);
    }

    
}