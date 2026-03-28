package ru.kfu.hub.integration.dto;

import ru.kfu.hub.integration.entity.SyncJob;
import ru.kfu.hub.integration.entity.enums.SyncJobStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record SyncJobResponse(
        UUID id,
        UUID systemId,
        String systemName,
        String resourceType,
        SyncJobStatus status,
        Integer recordsProcessed,
        String errorMessage,
        LocalDateTime startedAt,
        LocalDateTime completedAt,
        LocalDateTime createdAt
) {
    public static SyncJobResponse from(SyncJob j) {
        return new SyncJobResponse(
                j.getId(),
                j.getSystem().getId(),
                j.getSystem().getName(),
                j.getResourceType(),
                j.getStatus(),
                j.getRecordsProcessed(),
                j.getErrorMessage(),
                j.getStartedAt(),
                j.getCompletedAt(),
                j.getCreatedAt()
        );
    }
}
