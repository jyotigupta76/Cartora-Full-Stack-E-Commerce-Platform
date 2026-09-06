package com.ecommerce.ecommerce.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class UpdateCartItemRequest {

    @NotNull
    @Positive(message = "Quantity must be at least 1")
    private Integer quantity;
}
