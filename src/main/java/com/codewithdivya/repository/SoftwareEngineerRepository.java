package com.codewithdivya.repository;

import com.codewithdivya.entity.SoftwareEngineer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SoftwareEngineerRepository extends JpaRepository<SoftwareEngineer,Integer> {
    // Search by name (case insensitive)
    List<SoftwareEngineer> findByNameContainingIgnoreCase(String name);

    // Filter by experience level
    List<SoftwareEngineer> findByExperience(String experience);

    // Filter by location
    List<SoftwareEngineer> findByLocation(String location);

}
