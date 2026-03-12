package com.RailSenseAI_backend.repository;

import com.RailSenseAI_backend.entity.NetworkLog;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NetworkLogRepository extends Neo4jRepository<NetworkLog, Long> {

    // Objective 1: Retrieve the most recent disruptions for the dashboard [cite: 108]
    List<NetworkLog> findTop10ByOrderByTimestampDesc();
}