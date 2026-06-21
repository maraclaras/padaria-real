package com.padaria.service;

import com.padaria.model.Waste;
import com.padaria.model.Product;
import com.padaria.repository.WasteRepository;
import com.padaria.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class WasteService {

    @Autowired
    private WasteRepository wasteRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Waste> getAllWaste() {
        return wasteRepository.findAll();
    }

    public Optional<Waste> getWasteById(Long id) {
        return wasteRepository.findById(id);
    }

    public List<Waste> getWasteByProduct(Long productId) {
        return wasteRepository.findByProductId(productId);
    }

    public List<Waste> getWasteByDateRange(Long startDate, Long endDate) {
        return wasteRepository.findByDateRange(startDate, endDate);
    }

    public Waste createWaste(Waste waste) {
        // Calcula a perda total se não estiver preenchida
        if (waste.getTotalLoss() == null) {
            waste.setTotalLoss(waste.getQuantityWasted() * waste.getUnitCost());
        }

        Optional<Product> product = productRepository.findById(waste.getProductId());
        if (waste.getCompanyId() == null && product.isPresent()) {
            waste.setCompanyId(product.get().getCompanyId());
        }

        // Salva o desperdício
        Waste savedWaste = wasteRepository.save(waste);

        // Reduz a quantidade do produto
        if (product.isPresent()) {
            Product p = product.get();
            int newQuantity = p.getQuantity() - waste.getQuantityWasted();
            p.setQuantity(Math.max(0, newQuantity)); // Não permite quantidade negativa
            p.setUpdatedAt(System.currentTimeMillis());
            productRepository.save(p);
        }

        return savedWaste;
    }

    public Waste updateWaste(Long id, Waste wasteDetails) {
        Optional<Waste> waste = wasteRepository.findById(id);
        if (waste.isPresent()) {
            Waste w = waste.get();
            if (wasteDetails.getQuantityWasted() != null) {
                w.setQuantityWasted(wasteDetails.getQuantityWasted());
            }
            if (wasteDetails.getReason() != null) {
                w.setReason(wasteDetails.getReason());
            }
            if (wasteDetails.getCompanyId() != null) {
                w.setCompanyId(wasteDetails.getCompanyId());
            } else if (w.getCompanyId() == null && w.getProductId() != null) {
                productRepository.findById(w.getProductId())
                        .map(Product::getCompanyId)
                        .ifPresent(w::setCompanyId);
            }
            if (wasteDetails.getUnitCost() != null) {
                w.setUnitCost(wasteDetails.getUnitCost());
            }
            // Recalcula a perda total
            w.setTotalLoss(w.getQuantityWasted() * w.getUnitCost());
            return wasteRepository.save(w);
        }
        return null;
    }

    public void deleteWaste(Long id) {
        Optional<Waste> waste = wasteRepository.findById(id);
        if (waste.isPresent()) {
            // Restaura a quantidade do produto
            Waste w = waste.get();
            Optional<Product> product = productRepository.findById(w.getProductId());
            if (product.isPresent()) {
                Product p = product.get();
                p.setQuantity(p.getQuantity() + w.getQuantityWasted());
                p.setUpdatedAt(System.currentTimeMillis());
                productRepository.save(p);
            }
        }
        wasteRepository.deleteById(id);
    }

    public Double getTotalWasteLoss() {
        Double total = wasteRepository.getTotalWasteLoss();
        return total != null ? total : 0.0;
    }

    public Long getTotalWasteCount() {
        Long count = wasteRepository.getTotalWasteCount();
        return count != null ? count : 0L;
    }
}
