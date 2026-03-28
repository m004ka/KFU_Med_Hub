package ru.kfu.hub.dataset.dto.response;

import ru.kfu.hub.dataset.entity.DatasetVersion;

import java.time.LocalDateTime;
import java.util.UUID;

public record DatasetVersionResponse(
        UUID id,
        Integer versionNumber,
        String fileName,
        Long fileSize,
        String checksum,
        UUID createdBy,
        String changeNote,
        LocalDateTime createdAt
) {
    public static DatasetVersionResponse from(DatasetVersion v) {
        return new DatasetVersionResponse(
                v.getId(),
                v.getVersionNumber(),
                v.getFileName(),
                v.getFileSize(),
                v.getChecksum(),
                v.getCreatedBy(),
                v.getChangeNote(),
                v.getCreatedAt()
        );
    }
}
