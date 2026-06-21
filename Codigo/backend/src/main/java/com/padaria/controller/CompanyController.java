package com.padaria.controller;

import com.padaria.model.Company;
import com.padaria.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        Optional<Company> company = companyService.getCompanyById(id);
        return company.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Company>> searchCompanies(@RequestParam String term) {
        List<Company> companies = companyService.searchCompanies(term);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Company>> getCompaniesByTipo(@PathVariable String tipo) {
        List<Company> companies = companyService.getCompaniesByTipo(tipo);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/matriz/{matrizId}/filiais")
    public ResponseEntity<List<Company>> getBranchesByMatriz(@PathVariable Long matrizId) {
        List<Company> companies = companyService.getBranchesByMatriz(matrizId);
        return ResponseEntity.ok(companies);
    }

    @PostMapping
    public ResponseEntity<?> createCompany(@Valid @RequestBody Company company) {
        try {
            Company createdCompany = companyService.createCompany(company);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCompany);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable Long id, @Valid @RequestBody Company companyDetails) {
        try {
            Company updatedCompany = companyService.updateCompany(id, companyDetails);
            if (updatedCompany != null) {
                return ResponseEntity.ok(updatedCompany);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        try {
            if (companyService.deleteCompany(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
