package com.RailSenseAI_backend.config;

import com.RailSenseAI_backend.entity.Station;
import com.RailSenseAI_backend.entity.RouteConnection;
import com.RailSenseAI_backend.repository.StationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(StationRepository stationRepo) {
        return args -> {
            // Objective 10: Initializing the graph topology for interactive exploration [cite: 108, 114]
            if (stationRepo.count() == 0) {

                // 1. Create Station Nodes (Objective 1) [cite: 15]
                // We pass an empty ArrayList instead of null to prevent NullPointerException
                Station ndls = new Station("NDLS", "New Delhi", 28.6139, 77.2090, "CLEAR", new ArrayList<>());
                Station bpl = new Station("BPL", "Bhopal Junction", 23.2599, 77.4126, "CLEAR", new ArrayList<>());
                Station mas = new Station("MAS", "MGR Chennai Central", 13.0827, 80.2707, "CLEAR", new ArrayList<>());
                Station mum = new Station("MUM", "Mumbai Central", 18.9696, 72.8193, "CLEAR", new ArrayList<>());

                // 2. Create Route Connections (Edges representing rail connections) [cite: 16]
                RouteConnection ndlsToBpl = new RouteConnection(null, bpl, 700, 0);
                RouteConnection bplToMas = new RouteConnection(null, mas, 1400, 0);
                RouteConnection mumToBpl = new RouteConnection(null, bpl, 800, 0);

                // 3. Map connectivity between major railway corridors (Objective 1) [cite: 22]
                ndls.getConnections().add(ndlsToBpl);
                bpl.getConnections().add(bplToMas);
                mum.getConnections().add(mumToBpl);

                // 4. Save the Nodes (Neo4j automatically persists the relationships/edges) [cite: 14]
                stationRepo.saveAll(List.of(ndls, bpl, mas, mum));

                System.out.println("RAILSENSE: Graph Topology (Nodes & Edges) Loaded Successfully!");
            }
        };
    }
}