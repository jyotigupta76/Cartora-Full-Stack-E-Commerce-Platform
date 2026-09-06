package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.entity.OrderItem;
import com.ecommerce.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Finds every order-item that belongs to one of this seller's products -
    // this is how a seller sees "orders containing my products" without
    // seeing other sellers' items in the same order.
    @Query("SELECT oi FROM OrderItem oi WHERE oi.product.seller = :seller")
    List<OrderItem> findBySeller(@Param("seller") User seller);
}
