package com.retrievo.backend.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageStorageService {

    @Value("${app.upload.dir}")
    private String uploadDirectory;

    private static final Map<String, String> ALLOWED_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    public String storeImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image");
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_TYPES.containsKey(contentType)) {
            throw new IllegalArgumentException(
                    "Only JPG, PNG and WEBP images are allowed"
            );
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDirectory)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(uploadPath);

            // Generate a unique filename
            String fileName = UUID.randomUUID()
                    + ALLOWED_TYPES.get(contentType);

            Path filePath = uploadPath.resolve(fileName).normalize();

            // Save image
            Files.copy(file.getInputStream(), filePath);

            // Return the image URL
            return "/uploads/items/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Unable to upload image", e);
        }
    }
}