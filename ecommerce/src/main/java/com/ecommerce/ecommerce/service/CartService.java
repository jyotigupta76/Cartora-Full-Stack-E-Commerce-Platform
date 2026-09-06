package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.AddToCartRequest;
import com.ecommerce.ecommerce.entity.CartItem;
import com.ecommerce.ecommerce.entity.Product;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce.repository.CartItemRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public List<CartItem> getCart(User user) {
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(AddToCartRequest request, User user) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (request.getQuantity() > product.getStock()) {
            throw new IllegalArgumentException("Requested quantity exceeds available stock");
        }

        // If this product is already in the cart, increase quantity instead of duplicating a row
        CartItem existing = cartItemRepository.findByUserAndProduct(user, product).orElse(null);

        if (existing != null) {
            int newQuantity = Math.min(existing.getQuantity() + request.getQuantity(), product.getStock());
            existing.setQuantity(newQuantity);
            return cartItemRepository.save(existing);
        }

        CartItem item = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(request.getQuantity())
                .build();

        return cartItemRepository.save(item);
    }

    public CartItem updateQuantity(Long itemId, Integer quantity, User user) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to modify this cart item");
        }

        if (quantity > item.getProduct().getStock()) {
            throw new IllegalArgumentException("Requested quantity exceeds available stock");
        }

        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeItem(Long itemId, User user) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to remove this cart item");
        }

        cartItemRepository.delete(item);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }
}
