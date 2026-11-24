package com.retrievo.backend.service.impl;

import com.retrievo.backend.dto.CreateItemRequest;
import com.retrievo.backend.dto.ItemResponse;
import com.retrievo.backend.entity.ItemStatus;
import com.retrievo.backend.entity.User;

import java.util.List;

public interface ItemService {

    // Report a lost item
    ItemResponse reportLostItem(CreateItemRequest request, User user);

    // Report a found item
    ItemResponse reportFoundItem(CreateItemRequest request, User user);

    // Get all items
    List<ItemResponse> getAllItems();

    // Get item by ID
    ItemResponse getItemById(Long id);

    // Get reports submitted by the logged-in user
    List<ItemResponse> getMyReports(User user);

    ItemResponse updateItemStatus(Long itemId, ItemStatus status);

    void deleteItem(Long itemId);
}