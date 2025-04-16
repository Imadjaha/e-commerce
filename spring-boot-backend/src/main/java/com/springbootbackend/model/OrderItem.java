package com.springbootbackend.model;
import java.util.List;

import com.springbootbackend.model.Order;
import com.springbootbackend.model.Product;
import jakarta.persistence.*;
import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_Items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name="order_id",nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id",nullable = false)
    private Product product;

    private Integer quantity;
    private Double price;
}
