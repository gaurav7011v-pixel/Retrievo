package com.retrievo.backend.controller;

import com.retrievo.backend.dto.ItemResponse;
import com.retrievo.backend.entity.ItemStatus;

import com.retrievo.backend.service.impl.ItemService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/items")
@RequiredArgsConstructor
public class AdminItemController {

    private final ItemService itemService;

    // Get all items
    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    // Update item status
    @PutMapping("/{id}/status")
    public ResponseEntity<ItemResponse> updateItemStatus(
            @PathVariable Long id,
            @RequestParam ItemStatus status) {

        return ResponseEntity.ok(
                itemService.updateItemStatus(id, status)
        );
    }

    // Delete an item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {

        itemService.deleteItem(id);

        return ResponseEntity.noContent().build();
    }
}