package ru.kfu.hub.dataset.dto.response;

import ru.kfu.hub.dataset.entity.Dataset;
import ru.kfu.hub.dataset.entity.enums.DatasetDomain;
import ru.kfu.hub.dataset.entity.enums.DatasetFormat;
import ru.kfu.hub.dataset.entity.enums.DatasetStatus;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record DatasetSummaryResponse(
        UUID id,
        String title,
        DatasetDomain domain,
        DatasetFormat format,
        DatasetStatus status,
        String ownerName,
        Long recordCount,
        Long fileSize,
        Integer version,
        Set<String> tags,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static DatasetSummaryResponse from(Dataset d) {
        return new DatasetSummaryResponse(
                d.getId(),
                d.getTitle(),
                d.getDomain(),
                d.getFormat(),
                d.getStatus(),
                d.getOwnerName(),
                d.getRecordCount(),
                d.getFileSize(),
                d.getVersion(),
                d.getTags(),
                d.getCreatedAt(),
                d.getUpdatedAt()
        );
    }
}
