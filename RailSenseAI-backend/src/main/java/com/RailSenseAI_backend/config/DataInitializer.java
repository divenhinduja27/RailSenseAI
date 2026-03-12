package com.RailSenseAI_backend.config;

import com.RailSenseAI_backend.entity.Station;
import com.RailSenseAI_backend.entity.Route;
import com.RailSenseAI_backend.repository.StationRepository;
import com.RailSenseAI_backend.repository.RouteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(StationRepository stationRepo, RouteRepository routeRepo) {
        return args -> {
            // Only add data if the database is empty to avoid duplicates
            if (stationRepo.count() == 0) {
                // 1. Add Stations (Nodes) [cite: 15]
                Station ndls = new Station(null, "NDLS", "New Delhi", 28.6139, 77.2090, "CLEAR");
                Station bpl = new Station(null, "BPL", "Bhopal Junction", 23.2599, 77.4126, "CLEAR");
                Station mas = new Station(null, "MAS", "MGR Chennai Central", 13.0827, 80.2707, "CLEAR");
                Station mum = new Station(null, "MUM", "Mumbai Central", 18.9696, 72.8193, "CLEAR");

                stationRepo.saveAll(List.of(ndls, bpl, mas, mum));

                // 2. Add Routes (Edges) [cite: 16]
                // NDLS -> BPL
                routeRepo.save(new Route(null, "NDLS", "BPL", 700, "LOW"));
                // BPL -> MAS
                routeRepo.save(new Route(null, "BPL", "MAS", 1400, "LOW"));
                // MUM -> BPL
                routeRepo.save(new Route(null, "MUM", "BPL", 800, "LOW"));

                System.out.println("RAILSENSE: Initial Railway Network Data Loaded Successfully!");
            }
        };
    }
}