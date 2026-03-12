package com.RailSenseAI_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String stationCode; // e.g., "NDLS" [cite: 15]

    private String name; // e.g., "New Delhi"

    private Double latitude; // Needed for Angular Leaflet/Google Maps [cite: 108]
    private Double longitude;

    // Status can be "CLEAR", "CONGESTED", or "DELAYED" [cite: 36, 119]
    private String status;
}