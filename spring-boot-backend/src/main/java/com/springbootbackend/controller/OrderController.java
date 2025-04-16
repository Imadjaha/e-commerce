package com.springbootbackend.controller;


import com.springbootbackend.model.*;
import com.springbootbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping
    public List<Order> getUserOrders(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        if(user == null) return new ArrayList<>();
        return orderRepository.findByUserEntity(user);
    }

    @PostMapping("/place")
    public Order placeOrder(Principal principal) {
        // 1. Get user + cart
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        if(user == null) return null;

        Cart cart = cartRepository.findByUserEntity(user).orElse(null);
        if(cart == null || cart.getCartItems().isEmpty()) {
            return null; // Cart is empty
        }

        // 2. Create order with items
        Order order = new Order();
        order.setUserEntity(user);
        order.setOrderItems(new ArrayList<>());

        double totalPrice = 0.0;
        for(CartItem ci : cart.getCartItems()) {
            double itemPrice = ci.getProduct().getPrice() * ci.getQuantity();
            totalPrice += itemPrice;

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(ci.getProduct());
            orderItem.setQuantity(ci.getQuantity());
            orderItem.setPrice(ci.getProduct().getPrice());
            order.getOrderItems().add(orderItem);
        }
        order.setTotalPrice(totalPrice);
        orderRepository.save(order);

        // 3. Save items + link them
        for(OrderItem oi : order.getOrderItems()) {
            orderItemRepository.save(oi);
        }

        // 4. Clear user cart
        cartRepository.delete(cart);

        return order;
    }

    @PostMapping("/{orderId}/cancel")
    public Order cancelOrder(@PathVariable Long orderId, Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        if(user == null) return null;

        Order order = orderRepository.findById(orderId).orElse(null);
        if(order == null) return null;
        if(!order.getUserEntity().getUserId().equals(user.getUserId())) return null;

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}
