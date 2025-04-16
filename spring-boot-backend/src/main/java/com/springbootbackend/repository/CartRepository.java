package com.springbootbackend.repository;

import com.springbootbackend.model.Cart;
import com.springbootbackend.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart,Long> {
    Optional<Cart> findByUserEntity(UserEntity userEntity);
}
