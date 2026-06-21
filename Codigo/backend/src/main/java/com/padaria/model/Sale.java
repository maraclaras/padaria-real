package com.padaria.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sales")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    @Column(name = "company_id")
    private Long companyId;

    private Integer quantitySold;

    private Double unitPrice;

    private Double totalAmount;

    private String paymentMethod; // "Dinheiro", "Cartão", "PIX", etc
    private String notes;

    private Long saleDate;
    private Long createdAt;
    private Long updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = System.currentTimeMillis();
        updatedAt = System.currentTimeMillis();
        saleDate = System.currentTimeMillis();
        if (totalAmount == null) {
            totalAmount = quantitySold * unitPrice;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = System.currentTimeMillis();
    }

    // Getters
    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public Long getCompanyId() { return companyId; }
    public Integer getQuantitySold() { return quantitySold; }
    public Double getUnitPrice() { return unitPrice; }
    public Double getTotalAmount() { return totalAmount; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getNotes() { return notes; }
    public Long getSaleDate() { return saleDate; }
    public Long getCreatedAt() { return createdAt; }
    public Long getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public void setQuantitySold(Integer quantitySold) { this.quantitySold = quantitySold; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setSaleDate(Long saleDate) { this.saleDate = saleDate; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Long updatedAt) { this.updatedAt = updatedAt; }
}
