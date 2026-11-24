package com.retrievo.backend.service.impl;

import com.retrievo.backend.entity.User;

public interface JwtService {

    String generateToken(User user);

    String extractEmail(String token);

    boolean isTokenValid(String token, User user);
}