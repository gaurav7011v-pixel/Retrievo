package com.retrievo.backend.service.impl;

import com.retrievo.backend.dto.ClaimResponse;
import com.retrievo.backend.dto.CreateClaimRequest;
import com.retrievo.backend.entity.User;

import java.util.List;

public interface ClaimService {

    ClaimResponse submitClaim(CreateClaimRequest request, User claimant);

    List<ClaimResponse> getMyClaims(User claimant);

    List<ClaimResponse> getAllClaims();

    ClaimResponse approveClaim(Long claimId);

    ClaimResponse rejectClaim(Long claimId);
}