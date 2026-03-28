package ru.kfu.hub.dataset.dto.response;

import ru.kfu.hub.dataset.entity.Dataset;
import ru.kfu.hub.dataset.entity.enums.DatasetDomain;
import ru.kfu.hub.dataset.entity.enums.DatasetFormat;
import ru.kfu.hub.dataset.entity.enums.DatasetStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record DatasetResponse(
        UUID id,
        String title,
        String description,
        DatasetDomain domain,
        DatasetFormat format,
        DatasetStatus status,
        UUID ownerId,
        String ownerName,
        Long recordCount,
        String fileName,
        Long fileSize,
        String licenseType,
        Integer version,
        Set<String> tags,
        List<DatasetVersionResponse> versions,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime publishedAt
) {
    public static DatasetResponse from(Dataset d) {
        return new DatasetResponse(
                d.getId(),
                d.getTitle(),
                d.getDescription(),
                d.getDomain(),
                d.getFormat(),
                d.getStatus(),
                d.getOwnerId(),
                d.getOwnerName(),
                d.getRecordCount(),
                d.getFileName(),
                d.getFileSize(),
                d.getLicenseType(),
                d.getVersion(),
                d.getTags(),
                d.getVersions().stream().map(DatasetVersionResponse::from).collect(Collectors.toList()),
                d.getCreatedAt(),
                d.getUpdatedAt(),
                d.getPublishedAt()
        );
    }
}
