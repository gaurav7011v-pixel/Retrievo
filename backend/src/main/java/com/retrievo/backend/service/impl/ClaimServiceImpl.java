package com.retrievo.backend.service.impl;

import com.retrievo.backend.dto.ClaimResponse;
import com.retrievo.backend.dto.CreateClaimRequest;
import com.retrievo.backend.entity.*;
import com.retrievo.backend.exception.ItemNotFoundException;
import com.retrievo.backend.repository.ClaimRepository;
import com.retrievo.backend.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;

    @Override
    public ClaimResponse submitClaim(CreateClaimRequest request, User claimant) {

        // Find the item
        Item item = itemRepository.findByIdAndDeletedFalse(request.getItemId())
                .orElseThrow(() ->
                        new ItemNotFoundException(
                                "Item not found with ID: " + request.getItemId()
                        ));

        // Only FOUND items can be claimed
        if (item.getItemType() != ItemType.FOUND) {
            throw new IllegalArgumentException(
                    "You can only submit claims for found items."
            );
        }

        // Check whether the student already claimed this item
        if (claimRepository.existsByItemIdAndClaimantId(
                item.getId(), claimant.getId())) {

            throw new IllegalArgumentException(
                    "You have already submitted a claim for this item."
            );
        }

        // Create claim
        Claim claim = new Claim();

        claim.setItem(item);
        claim.setClaimant(claimant);
        claim.setProof(request.getProof());
        claim.setAdditionalInfo(request.getAdditionalInfo());
        claim.setStatus(ClaimStatus.PENDING);

        // Save claim
        Claim savedClaim = claimRepository.save(claim);

        return mapToResponse(savedClaim);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClaimResponse> getMyClaims(User claimant) {

        return claimRepository.findByClaimantId(claimant.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ClaimResponse> getAllClaims() {
        return claimRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ClaimResponse approveClaim(Long claimId) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() ->
                        new ItemNotFoundException("Claim not found with ID: " + claimId));

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only pending claims can be approved"
            );
        }

        claim.setStatus(ClaimStatus.APPROVED);

        // Update the associated item's status
        Item item = claim.getItem();
        item.setStatus(ItemStatus.CLAIMED);

        Claim savedClaim = claimRepository.save(claim);

        return mapToResponse(savedClaim);
    }

    @Override
    public ClaimResponse rejectClaim(Long claimId) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() ->
                        new ItemNotFoundException("Claim not found with ID: " + claimId));

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only pending claims can be rejected"
            );
        }

        claim.setStatus(ClaimStatus.REJECTED);

        Claim savedClaim = claimRepository.save(claim);

        return mapToResponse(savedClaim);
    }

    // Convert Claim entity into ClaimResponse DTO
    private ClaimResponse mapToResponse(Claim claim) {

        ClaimResponse response = new ClaimResponse();

        response.setId(claim.getId());
        response.setItemId(claim.getItem().getId());
        response.setItemName(claim.getItem().getItemName());
        response.setProof(claim.getProof());
        response.setAdditionalInfo(claim.getAdditionalInfo());
        response.setStatus(claim.getStatus());
        response.setClaimantId(claim.getClaimant().getId());
        response.setClaimantName(claim.getClaimant().getFullName());
        response.setCreatedAt(claim.getCreatedAt());

        return response;
    }
}