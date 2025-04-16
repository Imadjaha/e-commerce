package com.springbootbackend.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    private UserEntity userEntity;

    @OneToMany(mappedBy ="order",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<OrderItem> orderItems;

    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;
}
