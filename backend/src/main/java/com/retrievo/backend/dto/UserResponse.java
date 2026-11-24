package com.retrievo.backend.dto;

import com.retrievo.backend.entity.Role;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String department;

    private Integer academicYear;

    private Role role;

    private boolean enabled;

    private LocalDateTime createdAt;
}