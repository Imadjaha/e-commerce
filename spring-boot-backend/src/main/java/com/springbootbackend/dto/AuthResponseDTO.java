package com.springbootbackend.dto;

import lombok.Data;


@Data
public class AuthResponseDTO {


    private String accessToken;
    private String tokenType = "Bearer";


    public AuthResponseDTO(String accessToken, String tokenType) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
    }

    public AuthResponseDTO(String accessToken) {
        this.accessToken = accessToken;
    }
}