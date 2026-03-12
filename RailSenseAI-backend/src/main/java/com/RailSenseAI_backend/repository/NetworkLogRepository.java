package com.RailSenseAI_backend.repository;

import com.RailSenseAI_backend.entity.NetworkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NetworkLogRepository extends JpaRepository<NetworkLog, Long> {
    // Allows the dashboard to show the latest 10 disruptions
    List<NetworkLog> findTop10ByOrderByTimestampDesc();
}