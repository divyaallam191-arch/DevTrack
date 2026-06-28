package com.codewithdivya.controller;
import java.util.List;

import com.codewithdivya.exception.ApiResponse;
import com.codewithdivya.entity.SoftwareEngineer;
import com.codewithdivya.service.SoftwareEngineerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("api/v1/software-engineers")
@Tag(name = "Software Engineer API",
        description = "CRUD operations for managing Software Engineers")
public class SoftwareEngineerController {

    private final SoftwareEngineerService softwareEngineerService;

    public SoftwareEngineerController(SoftwareEngineerService softwareEngineerService) {
        this.softwareEngineerService = softwareEngineerService;
    }

    @GetMapping
    @Operation(summary = "Get all engineers",
            description = "Returns a list of all software engineers")
    public ResponseEntity<ApiResponse<List<SoftwareEngineer>>> getAllEngineers() {
        List<SoftwareEngineer> engineers = softwareEngineerService.getAllSoftwareEngineers();
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Fetched all engineers", engineers)
        );
    }

    @PostMapping
    @Operation(summary = "Add new engineer",
            description = "Creates a new software engineer record")
    public ResponseEntity<ApiResponse<Void>> addNewSoftwareEngineer(@Valid
            @RequestBody SoftwareEngineer softwareEngineer) {
        softwareEngineerService.insertSoftwareEngineer(softwareEngineer);
        return ResponseEntity.status(201).body(
                new ApiResponse<>("success", "Engineer created successfully", null)
        );
    }

    @PutMapping("{id}")
    @Operation(summary = "Update engineer",
            description = "Updates an existing engineer by their ID")
    public ResponseEntity<ApiResponse<SoftwareEngineer>> updateEngineer(
            @PathVariable Integer id,
            @RequestBody SoftwareEngineer engineer) {
        SoftwareEngineer existing = softwareEngineerService.findById(id)
                .orElseThrow(() -> new RuntimeException("Engineer not found"));
        existing.setName(engineer.getName());
        existing.setTechstack(engineer.getTechstack());
        existing.setEmail(engineer.getEmail());
        existing.setExperience(engineer.getExperience());
        existing.setLocation(engineer.getLocation());
        SoftwareEngineer updated = softwareEngineerService.save(existing);
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Engineer updated successfully", updated)
        );
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEngineer(@PathVariable Integer id) {
        softwareEngineerService.deleteById(id);
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Engineer deleted successfully", null)
        );
    }
    // Search by name
// URL: /api/v1/software-engineers/search?name=Divya
    @GetMapping("/search")
    @Operation(summary = "Search by name",
            description = "Search engineers by name (case insensitive)")
    public ResponseEntity<ApiResponse<List<SoftwareEngineer>>> searchByName(
            @RequestParam String name) {
        List<SoftwareEngineer> result = softwareEngineerService.searchByName(name);
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Search results for: " + name, result)
        );
    }

    // Filter by experience
// URL: /api/v1/software-engineers/experience?level=junior
    @GetMapping("/experience")
    @Operation(summary = "Filter by experience",
            description = "Filter engineers by experience level: junior, mid, senior")
    public ResponseEntity<ApiResponse<List<SoftwareEngineer>>> filterByExperience(
            @RequestParam String level) {
        List<SoftwareEngineer> result = softwareEngineerService.filterByExperience(level);
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Engineers with experience: " + level, result)
        );
    }

    // Filter by location
// URL: /api/v1/software-engineers/location?city=Hyderabad
    @GetMapping("/location")
    @Operation(summary = "Filter by location",
            description = "Filter engineers by their city/location")
    public ResponseEntity<ApiResponse<List<SoftwareEngineer>>> filterByLocation(
            @RequestParam String city) {
        List<SoftwareEngineer> result = softwareEngineerService.filterByLocation(city);
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Engineers in: " + city, result)
        );
    }



    // Add this endpoint
    @GetMapping("/paginated")
    @Operation(summary = "Get engineers with pagination",
            description = "Returns engineers page by page with sorting")
    public ResponseEntity<ApiResponse<Page<SoftwareEngineer>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "name") String sortBy) {

        Page<SoftwareEngineer> result = softwareEngineerService
                .getAllWithPagination(page, size, sortBy);
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Page " + page + " of engineers", result)
        );
    }

    @GetMapping("{id}")
    @Operation(summary = "Get engineer by ID",
            description = "Returns a single engineer by their ID")
    public ResponseEntity<ApiResponse<SoftwareEngineer>> getEngineerById(@PathVariable Integer id) {
        SoftwareEngineer engineer = softwareEngineerService.getSoftwareEngineerById(id);
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Engineer found", engineer)
        );
    }

}