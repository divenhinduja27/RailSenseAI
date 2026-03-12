package com.RailSenseAI_backend.repository;

import com.RailSenseAI_backend.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
    Optional<Station> findByStationCode(String stationCode);
}