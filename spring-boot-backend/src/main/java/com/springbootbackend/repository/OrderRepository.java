package com.springbootbackend.repository;

import com.springbootbackend.model.Order;
import com.springbootbackend.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserEntity(UserEntity userEntity);
}
