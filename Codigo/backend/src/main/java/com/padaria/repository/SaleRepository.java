package com.padaria.repository;

import com.padaria.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByProductId(Long productId);
    
    @Query("SELECT s FROM Sale s WHERE s.saleDate >= :startDate AND s.saleDate <= :endDate ORDER BY s.saleDate DESC")
    List<Sale> findByDateRange(@Param("startDate") Long startDate, @Param("endDate") Long endDate);
    
    @Query("SELECT SUM(s.totalAmount) FROM Sale s")
    Double getTotalRevenue();
    
    @Query("SELECT COUNT(s) FROM Sale s")
    Long getTotalSalesCount();
}
