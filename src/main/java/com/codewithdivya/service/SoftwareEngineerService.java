package com.codewithdivya.service;

import com.codewithdivya.entity.SoftwareEngineer;
import com.codewithdivya.repository.SoftwareEngineerRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

@Service
public class SoftwareEngineerService {
    private final SoftwareEngineerRepository softwareEngineerRepository;
    public SoftwareEngineerService(SoftwareEngineerRepository softwareEngineerRepository){
        this.softwareEngineerRepository= softwareEngineerRepository;
    }

    public List<SoftwareEngineer> getAllSoftwareEngineers(){
        return softwareEngineerRepository.findAll();
    }

    public void insertSoftwareEngineer(SoftwareEngineer softwareEngineer) {
        softwareEngineerRepository.save(softwareEngineer);
    }
    public SoftwareEngineer getSoftwareEngineerById(Integer Id){
        return softwareEngineerRepository.findById(Id).orElseThrow(()->  new IllegalStateException(Id+" not found"));
    }
    public Optional<SoftwareEngineer> findById(Integer id) {
        return softwareEngineerRepository.findById(id);
    }

    public SoftwareEngineer save(SoftwareEngineer engineer) {
        return softwareEngineerRepository.save(engineer);
    }
    public void deleteById(Integer id) {
        softwareEngineerRepository.deleteById(id);
    }
    public List<SoftwareEngineer> searchByName(String name) {
        return softwareEngineerRepository.findByNameContainingIgnoreCase(name);
    }

    public List<SoftwareEngineer> filterByExperience(String experience) {
        return softwareEngineerRepository.findByExperience(experience);
    }

    public List<SoftwareEngineer> filterByLocation(String location) {
        return softwareEngineerRepository.findByLocation(location);
    }
    public Page<SoftwareEngineer> getAllWithPagination(int page, int size, String sortBy) {
        return softwareEngineerRepository.findAll(
                PageRequest.of(page, size, Sort.by(sortBy).ascending())
        );
    }
}
