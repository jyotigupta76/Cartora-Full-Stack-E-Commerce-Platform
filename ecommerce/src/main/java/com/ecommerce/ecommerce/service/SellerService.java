package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.SellerStatsResponse;
import com.ecommerce.ecommerce.entity.Order;
import com.ecommerce.ecommerce.entity.OrderItem;
import com.ecommerce.ecommerce.entity.Product;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.repository.OrderItemRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    private static final int LOW_STOCK_THRESHOLD = 5;

    // Returns the distinct orders that contain at least one of this seller's
    // products - a seller only sees orders relevant to them, not the whole
    // order if it also contains other sellers' items.
    public List<Order> getSellerOrders(User seller) {
        List<OrderItem> items = orderItemRepository.findBySeller(seller);

        Set<Order> orders = new LinkedHashSet<>();
        for (OrderItem item : items) {
            orders.add(item.getOrder());
        }
        return orders.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public SellerStatsResponse getSellerStats(User seller) {
        Page<Product> products = productRepository.findBySeller(seller, Pageable.unpaged());
        long totalProducts = products.getTotalElements();

        long lowStockCount = products.getContent().stream()
                .filter(p -> p.getStock() <= LOW_STOCK_THRESHOLD)
                .count();

        List<OrderItem> items = orderItemRepository.findBySeller(seller);

        Set<Long> orderIds = items.stream()
                .map(item -> item.getOrder().getId())
                .collect(Collectors.toSet());
        long totalOrders = orderIds.size();

        // Revenue is based only on this seller's items within each order,
        // not the order's full total (which may include other sellers' items).
        BigDecimal totalRevenue = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return SellerStatsResponse.builder()
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .lowStockCount(lowStockCount)
                .build();
    }
}
