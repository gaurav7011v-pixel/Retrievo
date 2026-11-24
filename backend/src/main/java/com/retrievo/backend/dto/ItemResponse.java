package com.retrievo.backend.dto;

import com.retrievo.backend.entity.ItemStatus;
import com.retrievo.backend.entity.ItemType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ItemResponse {

    private Long id;

    private String itemName;

    private String category;

    private String description;

    private String location;

    private LocalDate itemDate;

    private String imageUrl;

    private String additionalDetails;

    private ItemType itemType;

    private ItemStatus status;

    private Long userId;

    private String reporterName;

    private LocalDateTime createdAt;
}