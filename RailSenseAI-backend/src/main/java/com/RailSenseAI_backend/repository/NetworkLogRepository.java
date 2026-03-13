package com.RailSenseAI_backend.repository;

import com.RailSenseAI_backend.entity.NetworkLog;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NetworkLogRepository extends Neo4jRepository<NetworkLog, Long> {

    /**
     * Returns the 10 most recent disruption logs.
     * Used for the operations dashboard.
     */
    List<NetworkLog> findTop10ByOrderByTimestampDesc();
}