package ru.kfu.hub.audit.dto;

import ru.kfu.hub.audit.entity.AuditLog;

import java.time.LocalDateTime;
import java.util.UUID;

public record AuditLogResponse(
        UUID id,
        UUID userId,
        String userName,
        String action,
        String entityType,
        String entityId,
        String details,
        String ipAddress,
        LocalDateTime createdAt
) {
    public static AuditLogResponse from(AuditLog log) {
        return new AuditLogResponse(
                log.getId(), log.getUserId(), log.getUserName(),
                log.getAction(), log.getEntityType(), log.getEntityId(),
                log.getDetails(), log.getIpAddress(), log.getCreatedAt()
        );
    }
}
