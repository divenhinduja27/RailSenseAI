package com.RailSenseAI_backend.dto;

import lombok.Data;

@Data
public class SimulationRequest {
    private String stationCode;
    private int delayMinutes;
}