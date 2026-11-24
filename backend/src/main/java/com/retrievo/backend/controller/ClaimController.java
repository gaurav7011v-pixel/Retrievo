package com.retrievo.backend.controller;

import com.retrievo.backend.dto.ClaimResponse;
import com.retrievo.backend.dto.CreateClaimRequest;
import com.retrievo.backend.entity.User;

import com.retrievo.backend.service.impl.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    // Submit a new claim
    @PostMapping
    public ResponseEntity<ClaimResponse> submitClaim(
            @Valid @RequestBody CreateClaimRequest request,
            @AuthenticationPrincipal User user) {

        ClaimResponse response = claimService.submitClaim(request, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get claims submitted by the logged-in student
    @GetMapping("/my-claims")
    public ResponseEntity<List<ClaimResponse>> getMyClaims(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(claimService.getMyClaims(user));
    }
}