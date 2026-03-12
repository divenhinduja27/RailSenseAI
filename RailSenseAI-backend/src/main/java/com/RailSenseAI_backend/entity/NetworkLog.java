package com.RailSenseAI_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "network_logs")
public class NetworkLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String triggerStation;   // The station where the delay started (e.g., NDLS)
    private String affectedStation;  // The station that got congested (e.g., BPL)
    private int delayMinutes;        // Severity of the delay
    private LocalDateTime timestamp; // When the disruption happened
}