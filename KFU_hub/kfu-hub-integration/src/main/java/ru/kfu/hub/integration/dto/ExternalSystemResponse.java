package ru.kfu.hub.integration.dto;

import ru.kfu.hub.integration.entity.ExternalSystem;
import ru.kfu.hub.integration.entity.enums.SystemType;

import java.time.LocalDateTime;
import java.util.UUID;

public record ExternalSystemResponse(
        UUID id,
        String name,
        SystemType type,
        String endpoint,
        boolean active,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ExternalSystemResponse from(ExternalSystem s) {
        return new ExternalSystemResponse(
                s.getId(), s.getName(), s.getType(), s.getEndpoint(),
                s.isActive(), s.getDescription(), s.getCreatedAt(), s.getUpdatedAt()
        );
    }
}
