package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.CheckoutRequest;
import com.ecommerce.ecommerce.entity.Order;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Order> checkout(@Valid @RequestBody CheckoutRequest request,
                                          Authentication authentication) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(orderService.checkout(request, user));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, Authentication authentication) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(orderService.getOrderById(id, user));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long id, Authentication authentication) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(orderService.cancelOrder(id, user));
    }

    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }
}
