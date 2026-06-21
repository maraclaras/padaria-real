package com.padaria.service;

import com.padaria.model.Sale;
import com.padaria.model.Product;
import com.padaria.repository.SaleRepository;
import com.padaria.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Optional<Sale> getSaleById(Long id) {
        return saleRepository.findById(id);
    }

    public List<Sale> getSalesByProduct(Long productId) {
        return saleRepository.findByProductId(productId);
    }

    public List<Sale> getSalesByDateRange(Long startDate, Long endDate) {
        return saleRepository.findByDateRange(startDate, endDate);
    }

    public Sale createSale(Sale sale) {
        // Calcula o total se não estiver preenchido
        if (sale.getTotalAmount() == null) {
            sale.setTotalAmount(sale.getQuantitySold() * sale.getUnitPrice());
        }

        Optional<Product> product = productRepository.findById(sale.getProductId());
        if (sale.getCompanyId() == null && product.isPresent()) {
            sale.setCompanyId(product.get().getCompanyId());
        }

        // Salva a venda
        Sale savedSale = saleRepository.save(sale);

        // Reduz a quantidade do produto
        if (product.isPresent()) {
            Product p = product.get();
            int newQuantity = p.getQuantity() - sale.getQuantitySold();
            p.setQuantity(Math.max(0, newQuantity)); // Não permite quantidade negativa
            p.setUpdatedAt(System.currentTimeMillis());
            productRepository.save(p);
        }

        return savedSale;
    }

    public Sale updateSale(Long id, Sale saleDetails) {
        Optional<Sale> sale = saleRepository.findById(id);
        if (sale.isPresent()) {
            Sale s = sale.get();
            if (saleDetails.getProductId() != null) {
                s.setProductId(saleDetails.getProductId());
            }
            if (saleDetails.getQuantitySold() != null) {
                s.setQuantitySold(saleDetails.getQuantitySold());
            }
            if (saleDetails.getUnitPrice() != null) {
                s.setUnitPrice(saleDetails.getUnitPrice());
            }
            if (saleDetails.getPaymentMethod() != null) {
                s.setPaymentMethod(saleDetails.getPaymentMethod());
            }
            if (saleDetails.getCompanyId() != null) {
                s.setCompanyId(saleDetails.getCompanyId());
            } else if (s.getCompanyId() == null && s.getProductId() != null) {
                productRepository.findById(s.getProductId())
                        .map(Product::getCompanyId)
                        .ifPresent(s::setCompanyId);
            }
            if (saleDetails.getNotes() != null) {
                s.setNotes(saleDetails.getNotes());
            }
            if (saleDetails.getSaleDate() != null) {
                s.setSaleDate(saleDetails.getSaleDate());
            }
            // Recalcula o total
            s.setTotalAmount(s.getQuantitySold() * s.getUnitPrice());
            return saleRepository.save(s);
        }
        return null;
    }

    public void deleteSale(Long id) {
        Optional<Sale> sale = saleRepository.findById(id);
        if (sale.isPresent()) {
            // Restaura a quantidade do produto
            Sale s = sale.get();
            Optional<Product> product = productRepository.findById(s.getProductId());
            if (product.isPresent()) {
                Product p = product.get();
                p.setQuantity(p.getQuantity() + s.getQuantitySold());
                p.setUpdatedAt(System.currentTimeMillis());
                productRepository.save(p);
            }
        }
        saleRepository.deleteById(id);
    }

    public Double getTotalRevenue() {
        Double total = saleRepository.getTotalRevenue();
        return total != null ? total : 0.0;
    }

    public Long getTotalSalesCount() {
        Long count = saleRepository.getTotalSalesCount();
        return count != null ? count : 0L;
    }
}
