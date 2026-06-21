package com.padaria.controller;

import com.padaria.model.Sale;
import com.padaria.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SaleController {

    @Autowired
    private SaleService saleService;

    @GetMapping
    public ResponseEntity<List<Sale>> getAllSales() {
        List<Sale> sales = saleService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(@PathVariable Long id) {
        Optional<Sale> sale = saleService.getSaleById(id);
        return sale.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Sale>> getSalesByProduct(@PathVariable Long productId) {
        List<Sale> sales = saleService.getSalesByProduct(productId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Sale>> getSalesByDateRange(
            @RequestParam Long startDate,
            @RequestParam Long endDate) {
        List<Sale> sales = saleService.getSalesByDateRange(startDate, endDate);
        return ResponseEntity.ok(sales);
    }

    @PostMapping
    public ResponseEntity<Sale> createSale(@RequestBody Sale sale) {
        Sale created = saleService.createSale(sale);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sale> updateSale(@PathVariable Long id, @RequestBody Sale saleDetails) {
        Sale updated = saleService.updateSale(id, saleDetails);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id) {
        saleService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/statistics/revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        Double revenue = saleService.getTotalRevenue();
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/statistics/count")
    public ResponseEntity<Long> getTotalSalesCount() {
        Long count = saleService.getTotalSalesCount();
        return ResponseEntity.ok(count);
    }
}
