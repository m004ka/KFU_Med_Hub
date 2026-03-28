package ru.kfu.hub.audit.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record CreateAuditLogRequest(
        UUID userId,
        String userName,
        @NotBlank String action,
        String entityType,
        String entityId,
        String details,
        String ipAddress
) {}
