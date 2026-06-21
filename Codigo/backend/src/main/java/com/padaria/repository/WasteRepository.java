package com.padaria.repository;

import com.padaria.model.Waste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WasteRepository extends JpaRepository<Waste, Long> {
    List<Waste> findByProductId(Long productId);
    
    @Query("SELECT w FROM Waste w WHERE w.wasteDate >= :startDate AND w.wasteDate <= :endDate ORDER BY w.wasteDate DESC")
    List<Waste> findByDateRange(@Param("startDate") Long startDate, @Param("endDate") Long endDate);
    
    @Query("SELECT SUM(w.totalLoss) FROM Waste w")
    Double getTotalWasteLoss();
    
    @Query("SELECT COUNT(w) FROM Waste w")
    Long getTotalWasteCount();
}
