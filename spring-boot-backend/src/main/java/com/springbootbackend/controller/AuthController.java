package com.springbootbackend.controller;


import com.springbootbackend.dto.AuthResponseDTO;
import com.springbootbackend.dto.LoginDTO;
import com.springbootbackend.dto.RegisterDTO;
import com.springbootbackend.model.Role;
import com.springbootbackend.model.UserEntity;
import com.springbootbackend.repository.UserRepository;
import com.springbootbackend.security.JWTGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTGenerator jwtGenerator;


    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder, JWTGenerator jwtGenerator) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
    }
    @Value("#{'${app.admin.usernames}'.split(',')}")
    private List<String> adminUsernames;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO){
        if(userRepository.existsByUsername(registerDTO.getUsername())){
            return new ResponseEntity<>("Username is taken", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(registerDTO.getEmail())){
            return ResponseEntity.badRequest().body("Email is taken");
        }

        if(registerDTO.getUsername() == null ||
        registerDTO.getEmail() == null ||
        registerDTO.getPassword() == null){
            return new ResponseEntity<>(
                    "Please provide username, email and passowrd",
                    HttpStatus.BAD_REQUEST
            );
        }

        UserEntity user = new UserEntity();
        user.setUsername(registerDTO.getUsername());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        // ✅ Only assign ADMIN if user is in the allowed list
        if ( adminUsernames.contains(user.getUsername().toLowerCase())) {
            user.setRole(Role.ADMIN);
        } else {
            user.setRole(Role.USER);
        }


        userRepository.save(user);

        return  new ResponseEntity<>(
                "User registered successfully",
                HttpStatus.CREATED
        );

    }

    @PostMapping("login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDto) {
        try {
            // Benutzer authentifizieren
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getUsername(),
                            loginDto.getPassword()
                    )
            );

            // Sicherheitskontext aktualisieren
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // JWT-Token generieren
            String token = jwtGenerator.generateToken(authentication);

            return new ResponseEntity<>(
                    new AuthResponseDTO(token, token),
                    HttpStatus.OK
            );
        } catch (Exception ex) {
            throw new RuntimeException("Something went wrong", ex);
        }
    }
}
