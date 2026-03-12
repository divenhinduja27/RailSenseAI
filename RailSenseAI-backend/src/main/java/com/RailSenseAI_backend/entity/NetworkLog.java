package com.RailSenseAI_backend.entity;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Node("NetworkLog")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NetworkLog {

    @Id @GeneratedValue
    private Long id;

    private String triggerStation; // The origin of the delay cascade [cite: 61]
    private String affectedStation; // The station impacted by the cascade [cite: 26]
    private Integer delayMinutes; // Severity of the delay [cite: 27]
    private LocalDateTime timestamp; // Temporal marker for graph history
}