package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.AddToCartRequest;
import com.ecommerce.ecommerce.dto.UpdateCartItemRequest;
import com.ecommerce.ecommerce.entity.CartItem;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@Valid @RequestBody AddToCartRequest request,
                                              Authentication authentication) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(cartService.addToCart(request, user));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<CartItem> updateQuantity(@PathVariable Long itemId,
                                                   @Valid @RequestBody UpdateCartItemRequest request,
                                                   Authentication authentication) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(cartService.updateQuantity(itemId, request.getQuantity(), user));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId, Authentication authentication) {
        User user = currentUser(authentication);
        cartService.removeItem(itemId, user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        User user = currentUser(authentication);
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }

    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }
}
