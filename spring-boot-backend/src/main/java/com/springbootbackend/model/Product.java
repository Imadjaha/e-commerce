package com.springbootbackend.model;


import jakarta.persistence.*;
import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name= "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String productName;
    private String description;
    private Double price;
    private String category;
}
