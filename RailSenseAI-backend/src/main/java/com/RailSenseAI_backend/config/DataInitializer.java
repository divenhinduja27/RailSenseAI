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

            if (true) {

                System.out.println("RAILSENSE: Loading railway graph dataset...");

                Map<String, Station> stationMap = new HashMap<>();

                try {

                    BufferedReader stationReader =
                            new BufferedReader(new InputStreamReader(
                                    new ClassPathResource("stations.csv").getInputStream()));

                    String line;
                    boolean first = true;

                    while ((line = stationReader.readLine()) != null) {

                        if (first) {
                            first = false;
                            continue;
                        }

                        String[] data = line.split(",", -1);

                        if (data.length >= 4) {

                            String code = data[0].trim();
                            String name = data[1].trim();

                            double lng = Double.parseDouble(data[2].trim());
                            double lat = Double.parseDouble(data[3].trim());

                            Station station =
                                    new Station(code, name, lat, lng, "CLEAR");

                            stationMap.put(code, station);
                        }
                    }

                    stationReader.close();

                    System.out.println("RAILSENSE: Stations loaded: " + stationMap.size());


                    BufferedReader routeReader =
                            new BufferedReader(new InputStreamReader(
                                    new ClassPathResource("routes.csv").getInputStream()));

                    first = true;
                    int edgeCount = 0;

                    while ((line = routeReader.readLine()) != null) {

                        if (first) {
                            first = false;
                            continue;
                        }

                        String[] data = line.split(",", -1);

                        if (data.length >= 2) {

                            String sourceCode = data[0].trim();
                            String destCode = data[1].trim();

                            Station source = stationMap.get(sourceCode);
                            Station dest = stationMap.get(destCode);

                            if (source != null && dest != null) {

                                RouteConnection connection =
                                        new RouteConnection(dest, 500, 0);

                                source.getConnections().add(connection);

                                edgeCount++;
                            }
                        }
                    }

                    routeReader.close();

                    System.out.println("RAILSENSE: Routes loaded: " + edgeCount);

                    stationRepo.saveAll(stationMap.values());

                    System.out.println("RAILSENSE: Graph successfully loaded into Neo4j.");

                } catch (Exception e) {

                    System.err.println("RAILSENSE ERROR: Failed to load CSV dataset.");

                    e.printStackTrace();
                }
            }
            else {

                System.out.println("RAILSENSE: Graph already exists in Neo4j.");
            }
        };
    }
}