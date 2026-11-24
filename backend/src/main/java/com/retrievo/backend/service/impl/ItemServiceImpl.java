package com.retrievo.backend.service.impl;

import com.retrievo.backend.dto.CreateItemRequest;
import com.retrievo.backend.dto.ItemResponse;
import com.retrievo.backend.entity.Item;
import com.retrievo.backend.entity.ItemStatus;
import com.retrievo.backend.entity.ItemType;
import com.retrievo.backend.entity.User;
import com.retrievo.backend.exception.ItemNotFoundException;
import com.retrievo.backend.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    @Override
    public ItemResponse reportLostItem(CreateItemRequest request, User user) {

        Item item = mapToEntity(request);

        item.setItemType(ItemType.LOST);
        item.setStatus(ItemStatus.ACTIVE);
        item.setUser(user);

        Item savedItem = itemRepository.save(item);

        return mapToResponse(savedItem);
    }

    @Override
    public ItemResponse reportFoundItem(CreateItemRequest request, User user) {

        Item item = mapToEntity(request);

        item.setItemType(ItemType.FOUND);
        item.setStatus(ItemStatus.ACTIVE);
        item.setUser(user);

        Item savedItem = itemRepository.save(item);

        return mapToResponse(savedItem);
    }

    @Override
    public List<ItemResponse> getAllItems() {

        return itemRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ItemResponse getItemById(Long id) {

        Item item = itemRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new ItemNotFoundException(
                                "Item not found with ID: " + id
                        ));

        return mapToResponse(item);
    }

    @Override
    public List<ItemResponse> getMyReports(User user) {
        return itemRepository.findByUserIdAndDeletedFalse(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ItemResponse updateItemStatus(Long itemId, ItemStatus status) {

        Item item = itemRepository.findByIdAndDeletedFalse(itemId)
                .orElseThrow(() ->
                        new ItemNotFoundException("Item not found with ID: " + itemId));

        item.setStatus(status);

        Item updatedItem = itemRepository.save(item);

        return mapToResponse(updatedItem);
    }

    @Override
    public void deleteItem(Long itemId) {

        Item item = itemRepository.findByIdAndDeletedFalse(itemId)
                .orElseThrow(() ->
                        new ItemNotFoundException(
                                "Item not found with ID: " + itemId
                        ));

        item.setDeleted(true);

        itemRepository.save(item);
    }

    // Convert request DTO into Item entity
    private Item mapToEntity(CreateItemRequest request) {

        Item item = new Item();

        item.setItemName(request.getItemName());
        item.setCategory(request.getCategory());
        item.setDescription(request.getDescription());
        item.setLocation(request.getLocation());
        item.setItemDate(request.getItemDate());
        item.setImageUrl(request.getImageUrl());
        item.setAdditionalDetails(request.getAdditionalDetails());

        return item;
    }

    // Convert Item entity into response DTO
    private ItemResponse mapToResponse(Item item) {

        ItemResponse response = new ItemResponse();

        response.setId(item.getId());
        response.setItemName(item.getItemName());
        response.setCategory(item.getCategory());
        response.setDescription(item.getDescription());
        response.setLocation(item.getLocation());
        response.setItemDate(item.getItemDate());
        response.setImageUrl(item.getImageUrl());
        response.setAdditionalDetails(item.getAdditionalDetails());
        response.setItemType(item.getItemType());
        response.setStatus(item.getStatus());
        response.setUserId(item.getUser().getId());
        response.setReporterName(item.getUser().getFullName());
        response.setCreatedAt(item.getCreatedAt());

        return response;
    }
}