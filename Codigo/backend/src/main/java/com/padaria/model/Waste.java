package com.padaria.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "waste")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Waste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "ID do produto é obrigatório")
    private Long productId;

    @Column(name = "company_id")
    private Long companyId;

    @NotNull(message = "Quantidade desperdiçada é obrigatória")
    @Positive(message = "Quantidade deve ser maior que zero")
    private Integer quantityWasted;

    private String reason; // "Vencimento", "Queimado", "Estragado", etc

    @NotNull(message = "Custo unitário é obrigatório")
    @Positive(message = "Custo deve ser maior que zero")
    private Double unitCost;

    @NotNull(message = "Perda total é obrigatória")
    @Positive(message = "Perda deve ser maior que zero")
    private Double totalLoss;

    private Long wasteDate;
    private Long createdAt;
    private Long updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = System.currentTimeMillis();
        updatedAt = System.currentTimeMillis();
        wasteDate = System.currentTimeMillis();
        if (totalLoss == null) {
            totalLoss = quantityWasted * unitCost;
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
    public Integer getQuantityWasted() { return quantityWasted; }
    public String getReason() { return reason; }
    public Double getUnitCost() { return unitCost; }
    public Double getTotalLoss() { return totalLoss; }
    public Long getWasteDate() { return wasteDate; }
    public Long getCreatedAt() { return createdAt; }
    public Long getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public void setQuantityWasted(Integer quantityWasted) { this.quantityWasted = quantityWasted; }
    public void setReason(String reason) { this.reason = reason; }
    public void setUnitCost(Double unitCost) { this.unitCost = unitCost; }
    public void setTotalLoss(Double totalLoss) { this.totalLoss = totalLoss; }
    public void setWasteDate(Long wasteDate) { this.wasteDate = wasteDate; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Long updatedAt) { this.updatedAt = updatedAt; }
}
