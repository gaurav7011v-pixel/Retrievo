package com.retrievo.backend.controller;

import com.retrievo.backend.dto.ClaimResponse;
import com.retrievo.backend.service.impl.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/claims")
@RequiredArgsConstructor
public class AdminClaimController {

    private final ClaimService claimService;

    // Get all claims
    @GetMapping
    public ResponseEntity<List<ClaimResponse>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    // Approve a claim
    @PutMapping("/{id}/approve")
    public ResponseEntity<ClaimResponse> approveClaim(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                claimService.approveClaim(id)
        );
    }

    // Reject a claim
    @PutMapping("/{id}/reject")
    public ResponseEntity<ClaimResponse> rejectClaim(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                claimService.rejectClaim(id)
        );
    }
}