package com.retrievo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String tokenType;
    private Long userId;
    private String fullName;
    private String email;
    private String role;
}