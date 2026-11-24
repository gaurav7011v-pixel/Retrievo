package com.retrievo.backend.controller;

import com.retrievo.backend.dto.ChangePasswordRequest;
import com.retrievo.backend.dto.UpdateProfileRequest;
import com.retrievo.backend.dto.UserResponse;
import com.retrievo.backend.entity.User;
import com.retrievo.backend.service.impl.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(
            @AuthenticationPrincipal User user) {

        UserResponse response =
                userService.getUserProfile(user.getEmail());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {

        UserResponse response =
                userService.updateProfile(user.getEmail(), request);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(user.getEmail(), request);

        return ResponseEntity.ok("Password changed successfully");
    }
}