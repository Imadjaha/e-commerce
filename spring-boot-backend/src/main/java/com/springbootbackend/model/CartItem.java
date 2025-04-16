
package com.springbootbackend.model;


import jakarta.persistence.*;
        import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name= "cart_item")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemId;

    @ManyToOne
    @JoinColumn(name = "cart_id",nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id",nullable = false)
    private Product product;

    private Integer quantity;


}
