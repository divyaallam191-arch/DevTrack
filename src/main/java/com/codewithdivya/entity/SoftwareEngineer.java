package com.codewithdivya.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
public class SoftwareEngineer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;
    @NotBlank(message = "Techstack is required")
    private String techstack;
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;
    @NotBlank(message = "Experience is required")
    @Pattern(regexp = "junior|mid|senior",
            message = "Experience must be: junior, mid, or senior")
    private String experience; // junior/mid/senior

    @NotBlank(message = "Location is required")
    private String location;

    // Update your no-args constructor (keep as is)
    public SoftwareEngineer() {}

    // Update your all-args constructor
    public SoftwareEngineer(Integer id, String name, String techstack,
                            String email, String experience, String location) {
        this.id = id;
        this.name = name;
        this.techstack = techstack;
        this.email = email;
        this.experience = experience;
        this.location = location;
    }

    // Add getters and setters for new fields
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTechstack() {
        return techstack;
    }

    public void setTechstack(String techstack) {
        this.techstack = techstack;
    }
}
