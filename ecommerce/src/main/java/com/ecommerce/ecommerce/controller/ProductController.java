package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.ProductDTO;
import com.ecommerce.ecommerce.entity.Product;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final UserRepository userRepository;

    // ===== Public browsing: GET /api/products =====
    // Supports: ?search=iphone&categoryId=1&brand=Samsung&minPrice=100&maxPrice=500
    //           &minRating=4&inStock=true&sortBy=price&sortDir=asc&page=0&size=20
    @GetMapping("/api/products")
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> result = productService.searchProducts(
                search, categoryId, brand, minPrice, maxPrice, minRating, inStock, pageable
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/products/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // ===== Seller-only CRUD: /api/seller/products =====
    @PostMapping("/api/seller/products")
    public ResponseEntity<Product> create(@Valid @RequestBody ProductDTO dto, Authentication authentication) {
        User seller = currentUser(authentication);
        return ResponseEntity.ok(productService.createProduct(dto, seller));
    }

    @PutMapping("/api/seller/products/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id,
                                          @Valid @RequestBody ProductDTO dto,
                                          Authentication authentication) {
        User seller = currentUser(authentication);
        return ResponseEntity.ok(productService.updateProduct(id, dto, seller));
    }

    @DeleteMapping("/api/seller/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        User seller = currentUser(authentication);
        productService.deleteProduct(id, seller);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/seller/products")
    public ResponseEntity<Page<Product>> myProducts(Authentication authentication,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "20") int size) {
        User seller = currentUser(authentication);
        return ResponseEntity.ok(productService.getSellerProducts(seller, PageRequest.of(page, size)));
    }

    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }
}