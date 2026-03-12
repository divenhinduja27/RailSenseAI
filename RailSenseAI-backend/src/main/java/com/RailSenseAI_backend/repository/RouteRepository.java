package com.RailSenseAI_backend.repository;

import com.RailSenseAI_backend.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

    // Fulfills Objective 2: Used to find outgoing routes for Delay Cascade Prediction [cite: 26, 28]
    List<Route> findBySourceCode(String sourceCode);

    // Fulfills Objective 3 & 4: Used to find incoming routes for Congestion and Crowd Intelligence [cite: 36, 43]
    List<Route> findByTargetCode(String targetCode);
}