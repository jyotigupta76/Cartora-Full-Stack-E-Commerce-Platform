package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.ProductDTO;
import com.ecommerce.ecommerce.entity.*;
import com.ecommerce.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce.repository.CategoryRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import com.ecommerce.ecommerce.repository.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<Product> searchProducts(
            String search,
            Long categoryId,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating,
            Boolean inStock,
            Pageable pageable
    ) {
        var spec = ProductSpecification.filter(search, categoryId, brand, minPrice, maxPrice, minRating, inStock);
        return productRepository.findAll(spec, pageable);
    }

    public Product createProduct(ProductDTO dto, User seller) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .category(category)
                .brand(dto.getBrand())
                .price(dto.getPrice())
                .discountPrice(dto.getDiscountPrice())
                .stock(dto.getStock())
                .imageUrl(dto.getImageUrl())
                .seller(seller)
                .build();

        Product saved = productRepository.save(product);
        attachGalleryImages(saved, dto.getImageUrls());
        return productRepository.save(saved);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Page<Product> getSellerProducts(User seller, Pageable pageable) {
        return productRepository.findBySeller(seller, pageable);
    }

    public Product updateProduct(Long id, ProductDTO dto, User actingUser) {
        Product product = getProductById(id);

        boolean isOwner = product.getSeller().getId().equals(actingUser.getId());
        boolean isAdmin = actingUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to update this product");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCategory(category);
        product.setBrand(dto.getBrand());
        product.setPrice(dto.getPrice());
        product.setDiscountPrice(dto.getDiscountPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());

        Product saved = productRepository.save(product);

        if (dto.getImageUrls() != null) {
            saved.getImages().clear();
            attachGalleryImages(saved, dto.getImageUrls());
            saved = productRepository.save(saved);
        }

        return saved;
    }

    public void deleteProduct(Long id, User actingUser) {
        Product product = getProductById(id);

        boolean isOwner = product.getSeller().getId().equals(actingUser.getId());
        boolean isAdmin = actingUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to delete this product");
        }

        productRepository.delete(product);
    }

    private void attachGalleryImages(Product product, List<String> imageUrls) {
        if (imageUrls == null) return;
        List<ProductImage> images = new ArrayList<>();
        for (String url : imageUrls) {
            images.add(ProductImage.builder().imageUrl(url).product(product).build());
        }
        product.getImages().addAll(images);
    }
}
