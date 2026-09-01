package com.ecommerce.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDTO {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String brand;

    @NotNull
    @PositiveOrZero(message = "Price must be zero or greater")
    private BigDecimal price;

    private BigDecimal discountPrice;

    @NotNull
    @PositiveOrZero(message = "Stock must be zero or greater")
    private Integer stock;

    private String imageUrl;

    private List<String> imageUrls;
}