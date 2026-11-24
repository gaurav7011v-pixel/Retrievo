package com.retrievo.backend.dto;

import com.retrievo.backend.entity.ClaimStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClaimResponse {

    private Long id;

    private Long itemId;

    private String itemName;

    private String proof;

    private String additionalInfo;

    private ClaimStatus status;

    private Long claimantId;

    private String claimantName;

    private LocalDateTime createdAt;
}