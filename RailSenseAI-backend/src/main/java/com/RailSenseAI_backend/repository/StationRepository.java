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
     * Finds a reliable path between two stations (max 5 hops)
     * ignoring stations that are not CLEAR.
     */
    @Query("MATCH (start:Station {stationCode: $startCode})-[:CONNECTED_TO]->(next:Station) RETURN next LIMIT 5")
    List<Station> findReliableRoute(String startCode, String endCode);


    /**
     * Objective 6: Infrastructure Vulnerability & Network Resilience
     * Finds top 5 stations with highest connectivity.
     */
    @Query("MATCH (n:Station) " +
            "WITH n.stationCode AS code, COUNT{ (n)--() } AS connections " +
            "RETURN {stationCode: code, connectionCount: connections} AS hubData " +
            "ORDER BY connections DESC LIMIT 5")
    List<Map<String, Object>> getHighImpactHubs();


    /**
     * Objective 2: Temporal Graph Disruption Analysis
     * Finds all stations within 3 hops of a failed station.
     */
    @Query("""
        MATCH (fail:Station {stationCode: $failedCode})-[:CONNECTED_TO*1..3]->(vulnerable:Station)
        RETURN vulnerable
    """)
    List<Station> findVulnerableNodes(String failedCode);
}