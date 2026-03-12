package com.RailSenseAI_backend.entity;

import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@RelationshipProperties // Tells Neo4j this data lives on the line connecting two nodes [cite: 16]
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteConnection {

    @RelationshipId
    private Long id; // Neo4j requires an internal ID for relationships

    @TargetNode
    private Station targetStation; // The station this track leads to

    private Integer distance; // Distance in kilometers

    // The critical metric for Objective 2 cascades [cite: 26, 27]
    private Integer delayMinutes;
}