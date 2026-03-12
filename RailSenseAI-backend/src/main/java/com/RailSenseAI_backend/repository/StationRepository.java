package com.RailSenseAI_backend.repository;

import com.RailSenseAI_backend.entity.Station;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface StationRepository extends Neo4jRepository<Station, String> {

    /**
     * Objective 7: Intelligent Routing & Operational Optimization
     * Finds a reliable path between two stations by evaluating all valid routes up to 5 hops,
     * filtering out any routes with delays, and returning the shortest clean path.
     */
    /**
     * Objective 7: Intelligent Routing & Operational Optimization
     * Finds a reliable path by evaluating all valid routes, picking the shortest,
     * and UNWINDING the result so Spring Boot can map it to a List of Stations.
     */
    @Query("MATCH path = (start:Station {stationCode: $startCode})-[:CONNECTED_TO*1..5]->(end:Station {stationCode: $endCode}) " +
            "WHERE ALL(n IN nodes(path) WHERE n.status = 'CLEAR') " +
            "WITH path ORDER BY length(path) ASC LIMIT 1 " +
            "UNWIND nodes(path) AS routeNode " +
            "RETURN routeNode")
    List<Station> findReliableRoute(String startCode, String endCode);

    /**
     * Objective 6: Infrastructure Vulnerability & Network Resilience
     * Identifies 'Bridge' stations using Degree Centrality.
     */
    @Query("MATCH (n:Station) " +
            "WITH n.stationCode AS code, count { (n)--() } AS connections " +
            "RETURN {stationCode: code, connectionCount: connections} AS hubData " +
            "ORDER BY connections DESC LIMIT 5")
    List<Map<String, Object>> getHighImpactHubs();

    /**
     * Objective 2: Temporal Graph Disruption Analysis
     * Finds all stations within 3 'hops' of a failure point.
     */
    @Query("MATCH (fail:Station {stationCode: $failedCode})-[:CONNECTED_TO*1..3]->(vulnerable:Station) " +
            "RETURN vulnerable")
    List<Station> findVulnerableNodes(String failedCode);
}