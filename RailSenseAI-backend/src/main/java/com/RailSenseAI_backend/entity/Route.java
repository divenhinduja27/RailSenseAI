package com.RailSenseAI_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sourceCode; // The starting Station node [cite: 16]

    @Column(nullable = false)
    private String targetCode; // The destination Station node [cite: 16]

    private Integer distance; // Distance in kilometers

    // Helps identify "vulnerable corridors" in the cascade model [cite: 28, 62]
    private String currentDelayLevel;
}