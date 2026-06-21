package com.padaria.controller;

import com.padaria.model.Waste;
import com.padaria.service.WasteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/waste")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class WasteController {

    @Autowired
    private WasteService wasteService;

    @GetMapping
    public ResponseEntity<List<Waste>> getAllWaste() {
        List<Waste> waste = wasteService.getAllWaste();
        return ResponseEntity.ok(waste);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Waste> getWasteById(@PathVariable Long id) {
        Optional<Waste> waste = wasteService.getWasteById(id);
        return waste.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Waste>> getWasteByProduct(@PathVariable Long productId) {
        List<Waste> waste = wasteService.getWasteByProduct(productId);
        return ResponseEntity.ok(waste);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Waste>> getWasteByDateRange(
            @RequestParam Long startDate,
            @RequestParam Long endDate) {
        List<Waste> waste = wasteService.getWasteByDateRange(startDate, endDate);
        return ResponseEntity.ok(waste);
    }

    @PostMapping
    public ResponseEntity<Waste> createWaste(@Valid @RequestBody Waste waste) {
        Waste created = wasteService.createWaste(waste);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Waste> updateWaste(@PathVariable Long id, @Valid @RequestBody Waste wasteDetails) {
        Waste updated = wasteService.updateWaste(id, wasteDetails);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWaste(@PathVariable Long id) {
        wasteService.deleteWaste(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/statistics/loss")
    public ResponseEntity<Double> getTotalWasteLoss() {
        Double loss = wasteService.getTotalWasteLoss();
        return ResponseEntity.ok(loss);
    }

    @GetMapping("/statistics/count")
    public ResponseEntity<Long> getTotalWasteCount() {
        Long count = wasteService.getTotalWasteCount();
        return ResponseEntity.ok(count);
    }
}
