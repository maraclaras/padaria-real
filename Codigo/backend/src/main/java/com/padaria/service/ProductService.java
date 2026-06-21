package com.padaria.service;

import com.padaria.model.Product;
import com.padaria.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getAvailableProducts() {
        return productRepository.findAllAvailable();
    }

    public List<Product> getLowStockProducts(Integer minimumQuantity) {
        return productRepository.findLowStockProducts(minimumQuantity);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        Optional<Product> existingProductOptional = productRepository.findById(id);

        if (existingProductOptional.isEmpty()) {
            return null;
        }

        Product existingProduct = existingProductOptional.get();

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setCostPrice(product.getCostPrice());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setCompanyId(product.getCompanyId());

        return productRepository.save(existingProduct);
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean updateQuantity(Long id, Integer quantity) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product p = product.get();
            p.setQuantity(quantity);
            p.setUpdatedAt(System.currentTimeMillis());
            productRepository.save(p);
            return true;
        }
        return false;
    }
}
