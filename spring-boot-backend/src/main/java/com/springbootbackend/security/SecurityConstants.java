package com.springbootbackend.security;

import java.security.Key;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class SecurityConstants {

    public static final long JWT_EXPIRATION = 5184000000L;

    public static final Key JWT_SECRET_KEY = Keys.secretKeyFor(
            SignatureAlgorithm.HS256
    );
}
