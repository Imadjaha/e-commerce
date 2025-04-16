package com.springbootbackend.security;


import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // <-- this enables @PreAuthorize and friends
public class SecurityConfig {
    
    private final JWTAuthEntryPoint authEntryPoint;

    private final CustomUserDetailsService userDetailsService;

    private final JWTGenerator jwtGenerator;

    public SecurityConfig(CustomUserDetailsService userDetailsService,
                          JWTAuthEntryPoint authEntryPoint,
                          JWTGenerator jwtGenerator){
        this.userDetailsService = userDetailsService;
        this.authEntryPoint = authEntryPoint;
        this.jwtGenerator = jwtGenerator;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf->csrf.disable())
                .cors(cors->cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(exceptionHandling->
                        exceptionHandling.authenticationEntryPoint(authEntryPoint))
                .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize ->
                        authorize
                                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**")
                                .permitAll()
                                .requestMatchers(
                                        "/api/auth/**",
                                        "/api/auth/login",
                                        "/api/auth/register"
                                )
                                .permitAll()
                                .requestMatchers("/api/**")
                                .authenticated()
                                .anyRequest()
                                .authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public JWTAuthenticationFilter jwtAuthenticationFilter(){
        return new JWTAuthenticationFilter(jwtGenerator,userDetailsService);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList("http://localhost:5173","http://localhost:3000")
        );

        configuration.setAllowedMethods(
                Arrays.asList("GET","POST","PUT","DELETE","OPTIONS")
        );

        configuration.setAllowedHeaders(Arrays.asList("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",configuration);
        return source;
    }
}
