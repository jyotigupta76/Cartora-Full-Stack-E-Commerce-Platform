package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.ProductDTO;
import com.ecommerce.ecommerce.dto.SellerStatsResponse;
import com.ecommerce.ecommerce.entity.Order;
import com.ecommerce.ecommerce.entity.Product;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.service.ProductService;
import com.ecommerce.ecommerce.service.SellerService;
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
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final SellerService sellerService;
    private final UserRepository userRepository;

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

    @PostMapping("/api/seller/products")
    public ResponseEntity<Product> create(@Valid @RequestBody ProductDTO dto, Authentication authentication) {
        User seller = currentUser(authentication);
        return ResponseEntity.ok(productService.createProduct(dto, seller));
    }

    @PutMapping("/api/seller/products/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id,
                                          @Valid @RequestBody ProductDTO dto,
                                          Authentication authentication) {
        User actingUser = currentUser(authentication);
        return ResponseEntity.ok(productService.updateProduct(id, dto, actingUser));
    }

    @DeleteMapping("/api/seller/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        User actingUser = currentUser(authentication);
        productService.deleteProduct(id, actingUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/seller/products")
    public ResponseEntity<Page<Product>> myProducts(Authentication authentication,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "20") int size) {
        User seller = currentUser(authentication);
        return ResponseEntity.ok(productService.getSellerProducts(seller, PageRequest.of(page, size)));
    }

    @GetMapping("/api/seller/orders")
    public ResponseEntity<List<Order>> getSellerOrders(Authentication authentication) {
        User seller = currentUser(authentication);
        return ResponseEntity.ok(sellerService.getSellerOrders(seller));
    }

    @GetMapping("/api/seller/stats")
    public ResponseEntity<SellerStatsResponse> getSellerStats(Authentication authentication) {
        User seller = currentUser(authentication);
        return ResponseEntity.ok(sellerService.getSellerStats(seller));
    }

    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }
}
