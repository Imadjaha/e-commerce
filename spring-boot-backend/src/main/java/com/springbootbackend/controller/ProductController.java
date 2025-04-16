package com.springbootbackend.controller;


import com.springbootbackend.model.Product;
import com.springbootbackend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    @GetMapping("/{productId}")
    public Product getProductById(@PathVariable Long productId){
        return productRepository.findById(productId).orElse(null);
    }

    @PreAuthorize("hasRole('ADMIN')")  // 🔒 Only allow ADMIN to add products
    @PostMapping
    public Product addProduct(@RequestBody Product product){
        return productRepository.save(product);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{productId}")
    public Product updateProduct(@PathVariable Long productId, @RequestBody Product productDetails){
        Product product = productRepository.findById(productId).orElse(null);
        if(product == null ) return null;
        product.setProductName(productDetails.getProductName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setCategory(productDetails.getCategory());

        return productRepository.save(product);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{productId}")
    public String deleteProduct(@PathVariable Long productId){
        productRepository.deleteById(productId);
        return "Product deleted successfully";
    }
}
