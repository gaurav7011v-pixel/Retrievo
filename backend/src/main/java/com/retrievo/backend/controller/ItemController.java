package com.retrievo.backend.controller;

import com.retrievo.backend.dto.CreateItemRequest;
import com.retrievo.backend.dto.ItemResponse;
import com.retrievo.backend.entity.User;

import com.retrievo.backend.service.impl.ImageStorageService;
import com.retrievo.backend.service.impl.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;
    private final ImageStorageService imageStorageService;

    // Report a lost item
    @PostMapping("/lost")
    public ResponseEntity<ItemResponse> reportLostItem(
            @Valid @RequestBody CreateItemRequest request,
            @AuthenticationPrincipal User user) {

        ItemResponse response =
                itemService.reportLostItem(request, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Report a found item
    @PostMapping("/found")
    public ResponseEntity<ItemResponse> reportFoundItem(
            @Valid @RequestBody CreateItemRequest request,
            @AuthenticationPrincipal User user) {

        ItemResponse response =
                itemService.reportFoundItem(request, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all items
    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAllItems() {

        return ResponseEntity.ok(itemService.getAllItems());
    }

    // Get item by ID
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(
            @PathVariable Long id) {

        return ResponseEntity.ok(itemService.getItemById(id));
    }

    // Get reports submitted by logged-in user
    @GetMapping("/my-reports")
    public ResponseEntity<List<ItemResponse>> getMyReports(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(itemService.getMyReports(user));
    }

    // Upload item image
    @PostMapping(
            value = "/upload-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file) {

        String imageUrl = imageStorageService.storeImage(file);

        return ResponseEntity.ok(
                Map.of("imageUrl", imageUrl)
        );
    }
}