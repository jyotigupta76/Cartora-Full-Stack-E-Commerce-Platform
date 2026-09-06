package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.CheckoutRequest;
import com.ecommerce.ecommerce.entity.*;
import com.ecommerce.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce.repository.CartItemRepository;
import com.ecommerce.ecommerce.repository.OrderRepository;
import com.ecommerce.ecommerce.repository.PaymentRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    private static final BigDecimal DELIVERY_CHARGE = new BigDecimal("100.00");

    @Transactional
    public Order checkout(CheckoutRequest request, User user) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cannot checkout with an empty cart");
        }

        // Build order items from the cart, snapshotting the price NOW
        // (so future price changes don't rewrite past orders), and
        // reduce stock for each product as we go.
        BigDecimal subtotal = BigDecimal.ZERO;
        Order order = Order.builder()
                .user(user)
                .recipientName(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .status(OrderStatus.PLACED)
                .build();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            if (cartItem.getQuantity() > product.getStock()) {
                throw new IllegalStateException(
                        "Insufficient stock for product: " + product.getName());
            }

            BigDecimal effectivePrice = product.getDiscountPrice() != null
                    ? product.getDiscountPrice()
                    : product.getPrice();

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(effectivePrice)
                    .build();

            order.getItems().add(orderItem);
            subtotal = subtotal.add(effectivePrice.multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            // Reduce stock now that the order is confirmed to be placed
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setSubtotal(subtotal);
        order.setDeliveryCharge(DELIVERY_CHARGE);
        order.setTotalAmount(subtotal.add(DELIVERY_CHARGE));

        Order savedOrder = orderRepository.save(order);

        // Create the payment record.
        // COD: mark as PENDING (collected on delivery) - order proceeds immediately.
        // ONLINE: mark as PENDING too - a real integration would only flip this to
        // SUCCESS after verifying the gateway's signature/webhook server-side.
        // See the note in CheckoutController-facing docs: never trust a frontend
        // claim of "payment succeeded" without that server-side check.
        Payment payment = Payment.builder()
                .order(savedOrder)
                .amount(savedOrder.getTotalAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .build();
        paymentRepository.save(payment);

        // Clear the cart now that the order has been created from it
        cartItemRepository.deleteByUser(user);

        return savedOrder;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Order getOrderById(Long id, User user) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to view this order");
        }

        return order;
    }

    @Transactional
    public Order cancelOrder(Long id, User user) {
        Order order = getOrderById(id, user);

        if (order.getStatus() == OrderStatus.SHIPPED
                || order.getStatus() == OrderStatus.OUT_FOR_DELIVERY
                || order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException(
                    "Cannot cancel an order that has already been " + order.getStatus());
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order is already cancelled");
        }

        // Restore stock for each item since the order didn't go through
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}
