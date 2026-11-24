package com.retrievo.backend.service.impl;

import com.retrievo.backend.dto.*;

import java.util.List;

public interface UserService {

    UserResponse registerUser(RegisterRequest request);

    LoginResponse loginUser(LoginRequest request);

    UserResponse getUserProfile(String email);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long userId);

    UserResponse activateUser(Long userId);

    UserResponse deactivateUser(Long userId);

    UserResponse updateProfile(
            String email,
            UpdateProfileRequest request
    );

    void changePassword(
            String email,
            ChangePasswordRequest request
    );
}