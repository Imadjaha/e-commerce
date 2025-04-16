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
@Table(name= "cart")
public class Cart {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartId;

    @OneToOne
    @JoinColumn(name="user_id")
    private UserEntity userEntity;

    @OneToMany(mappedBy = "cart",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<CartItem> cartItems;
}
