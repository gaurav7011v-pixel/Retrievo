package com.retrievo.backend.repository;

import com.retrievo.backend.dto.ItemResponse;
import com.retrievo.backend.entity.Item;
import com.retrievo.backend.entity.ItemType;
import com.retrievo.backend.entity.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    // Find all items reported by a particular user
    List<Item> findByUserId(Long userId);

    // Find items by their type (LOST or FOUND)
    List<Item> findByItemType(ItemType itemType);

    // Find items by their current status
    List<Item> findByStatus(ItemStatus status);

    // Find a user's reports by item type
    List<Item> findByUserIdAndItemType(Long userId, ItemType itemType);

    List<Item> findByDeletedFalse();

    Optional<Item> findByIdAndDeletedFalse(Long itemId);

    List<Item> findByUserIdAndDeletedFalse(Long userId);
}