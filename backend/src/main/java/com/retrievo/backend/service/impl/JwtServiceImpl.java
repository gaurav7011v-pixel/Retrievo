package com.retrievo.backend.service.impl;

import com.retrievo.backend.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
            return Keys.hmacShaKeyFor(secret.getBytes());
    }

    @Override
    public String generateToken(User user) {

        Date currentDate = new Date();
        Date expirationDate = new Date(currentDate.getTime() + expiration);

        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(currentDate)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();
    }

    @Override
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    @Override
    public boolean isTokenValid(String token, User user) {

        try {
            Claims claims = extractAllClaims(token);

            return claims.getSubject().equals(user.getEmail())
                    && claims.getExpiration().after(new Date());

        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}