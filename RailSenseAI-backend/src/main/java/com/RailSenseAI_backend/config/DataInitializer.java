package com.RailSenseAI_backend.config;

import com.RailSenseAI_backend.entity.Station;
import com.RailSenseAI_backend.entity.RouteConnection;
import com.RailSenseAI_backend.repository.StationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(StationRepository stationRepo) {
        return args -> {
            // Objective 1: Dynamic Railway Network Modeling
            if (stationRepo.count() == 0) {
                System.out.println("RAILSENSE: No existing graph found. Loading global datasets...");

                Map<String, Station> stationMap = new HashMap<>();

                try {
                    // 1. Read the Stations CSV
                    BufferedReader stationReader = new BufferedReader(new InputStreamReader(
                            new ClassPathResource("stations.csv").getInputStream()));

                    String line;
                    boolean isFirstLine = true;
                    while ((line = stationReader.readLine()) != null) {
                        if (isFirstLine) { isFirstLine = false; continue; } // Skip header

                        String[] data = line.split(",");
                        if (data.length >= 4) {
                            String code = data[0].trim();
                            String name = data[1].trim();
                            double lng = Double.parseDouble(data[2].trim());
                            double lat = Double.parseDouble(data[3].trim());

                            // Create the Node with a default CLEAR status
                            Station station = new Station(code, name, lat, lng, "CLEAR", new ArrayList<>());
                            stationMap.put(code, station);
                        }
                    }
                    stationReader.close();
                    System.out.println("RAILSENSE: Loaded " + stationMap.size() + " Station Nodes.");

                    // 2. Read the Routes CSV and build Edges
                    BufferedReader routeReader = new BufferedReader(new InputStreamReader(
                            new ClassPathResource("routes.csv").getInputStream()));

                    isFirstLine = true;
                    int edgeCount = 0;
                    while ((line = routeReader.readLine()) != null) {
                        if (isFirstLine) { isFirstLine = false; continue; } // Skip header

                        String[] data = line.split(",");
                        if (data.length >= 2) {
                            String sourceCode = data[0].trim();
                            String destCode = data[1].trim();

                            Station source = stationMap.get(sourceCode);
                            Station dest = stationMap.get(destCode);

                            if (source != null && dest != null) {
                                // Defaulting distance/weight to 500 for demo purposes (you can calculate Haversine later)
                                // Change 500.0 (double) to 500 (Integer) to satisfy the constructor
                                RouteConnection connection = new RouteConnection(null, dest, 500, 0);
                                source.getConnections().add(connection);
                                edgeCount++;
                            }
                        }
                    }
                    routeReader.close();
                    System.out.println("RAILSENSE: Loaded " + edgeCount + " Route Edges.");

                    // 3. Save the entire massive graph to Neo4j
                    stationRepo.saveAll(stationMap.values());
                    System.out.println("RAILSENSE: Live Global Dataset successfully ingested into Neo4j Graph Engine!");

                } catch (Exception e) {
                    System.err.println("RAILSENSE CRITICAL ERROR: Could not load global CSVs. " + e.getMessage());
                }
            } else {
                System.out.println("RAILSENSE: Graph Topology already populated in Neo4j. Ready for simulation.");
            }
        };
    }
}