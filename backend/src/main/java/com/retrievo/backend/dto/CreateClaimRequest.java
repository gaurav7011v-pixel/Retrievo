package com.retrievo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateClaimRequest {

    @NotNull(message = "Item ID is required")
    private Long itemId;

    @NotBlank(message = "Proof of ownership is required")
    @Size(max = 1000, message = "Proof cannot exceed 1000 characters")
    private String proof;

    @Size(max = 1000, message = "Additional information cannot exceed 1000 characters")
    private String additionalInfo;
}