package com.springbootbackend.controller;

import com.springbootbackend.model.Cart;
import com.springbootbackend.model.CartItem;
import com.springbootbackend.model.Product;
import com.springbootbackend.model.UserEntity;
import com.springbootbackend.repository.CartItemRepository;
import com.springbootbackend.repository.CartRepository;
import com.springbootbackend.repository.ProductRepository;
import com.springbootbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/cart")
public class CartController {

@Autowired
    private UserRepository userRepository;
@Autowired
    private CartRepository cartRepository;
@Autowired
    private CartItemRepository cartItemRepository;
@Autowired
    private ProductRepository productRepository;


    @GetMapping
    public Cart getUserCart(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return null;

        return cartRepository.findByUserEntity(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserEntity(user);
            newCart.setCartItems(new ArrayList<>());
            return cartRepository.save(newCart);
        });
    }
    @PostMapping
    public Cart addToCart(@RequestParam Long productId, @RequestParam int quantity, Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return null;

        // Fetch or create cart
        Cart cart = cartRepository.findByUserEntity(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserEntity(user);
            newCart.setCartItems(new ArrayList<>());
            return cartRepository.save(newCart);
        });

        // Check if item already in cart
        CartItem existingItem = cart.getCartItems().stream()
                .filter(cartItem -> cartItem.getProduct().getProductId().equals(productId))
                .findFirst().orElse(null);

        if (existingItem!= null){
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        }
        else{
            Product product = productRepository.findById(productId).orElse(null);
            if(product == null) return null;
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
            cart.getCartItems().add(cartItem);
        }

        return cartRepository.save(cart);

    }

    @DeleteMapping("/remove")
    public Cart removeFromCart(@RequestParam Long productId, Principal principal){
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);

        if(user== null) return null;

        Cart cart = cartRepository.findByUserEntity(user).orElse(null);
        if(cart == null) return null;

        cart.getCartItems().removeIf(cartItem -> cartItem.getProduct().getProductId().equals(productId));
        return cartRepository.save(cart);
    }

    @DeleteMapping("/clear")
    public String clearCart(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        if(user == null) return "User not found";

        Cart cart = cartRepository.findByUserEntity(user).orElse(null);
        if(cart == null) return "Cart is already empty";

        cartRepository.delete(cart);
        return "Cart cleared successfully";
    }
}
