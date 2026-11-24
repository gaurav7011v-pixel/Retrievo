package com.retrievo.backend.service.impl;

import com.retrievo.backend.dto.*;
import com.retrievo.backend.entity.Role;
import com.retrievo.backend.entity.User;
import com.retrievo.backend.exception.InvalidCredentialsException;
import com.retrievo.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional
    public UserResponse registerUser(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDepartment(request.getDepartment());
        user.setAcademicYear(request.getAcademicYear());

        // Backend controls these fields
        user.setRole(Role.STUDENT);
        user.setEnabled(true);
        User savedUser=userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Override
    public LoginResponse loginUser(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        // Find user by email
        User user = userRepository.findByEmail(email);

        // Check whether user exists
        if (user == null) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Check whether account is enabled
        if (!user.isEnabled()) {
            throw new InvalidCredentialsException("Account is disabled");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        // Return login response
        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Override
    public UserResponse getUserProfile(String email) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new InvalidCredentialsException("User not found");
        }

       return mapToUserResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found with ID: " + userId
                        ));

        return mapToUserResponse(user);
    }

    @Override
    public UserResponse activateUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found with ID: " + userId
                        ));

        user.setEnabled(true);

        User updatedUser = userRepository.save(user);

        return mapToUserResponse(updatedUser);
    }

    @Override
    public UserResponse deactivateUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found with ID: " + userId
                        ));

        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException(
                    "Administrator accounts cannot be deactivated"
            );
        }

        user.setEnabled(false);

        User updatedUser = userRepository.save(user);

        return mapToUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(
            String email,
            UpdateProfileRequest request) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        if (request.getAcademicYear() < 1 ||
                request.getAcademicYear() > 4) {
            throw new IllegalArgumentException(
                    "Academic year must be between 1 and 4"
            );
        }

        user.setFullName(request.getFullName().trim());
        user.setDepartment(request.getDepartment().trim());
        user.setAcademicYear(request.getAcademicYear());

        User updatedUser = userRepository.save(user);

        return mapToUserResponse(updatedUser);
    }


    @Override
    @Transactional
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        // Verify current password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new InvalidCredentialsException(
                    "Current password is incorrect"
            );
        }

        // Prevent using the same password
        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "New password must be different from current password"
            );
        }

        // Encrypt and save new password
        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);
    }

    public UserResponse mapToUserResponse(User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setDepartment(user.getDepartment());
        response.setAcademicYear(user.getAcademicYear());
        response.setRole(user.getRole());
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }
}