package com.padaria.repository;

import com.padaria.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByCategory(String category);

    @Query("SELECT p FROM Product p WHERE p.quantity > 0")
    List<Product> findAllAvailable();

    @Query("SELECT p FROM Product p WHERE p.quantity < :minimumQuantity")
    List<Product> findLowStockProducts(@Param("minimumQuantity") Integer minimumQuantity);

    Optional<Product> findByNameIgnoreCase(String name);

}
