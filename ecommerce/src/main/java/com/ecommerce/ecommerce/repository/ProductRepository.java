package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.entity.Product;
import com.ecommerce.ecommerce.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Page<Product> findBySeller(User seller, Pageable pageable);
}