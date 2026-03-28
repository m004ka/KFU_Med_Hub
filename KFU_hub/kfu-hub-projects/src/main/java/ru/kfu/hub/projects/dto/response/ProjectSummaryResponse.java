package ru.kfu.hub.projects.dto.response;

import ru.kfu.hub.projects.entity.Project;
import ru.kfu.hub.projects.entity.enums.ProjectStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record ProjectSummaryResponse(
        UUID id,
        String title,
        String description,
        ProjectStatus status,
        String ownerName,
        int memberCount,
        int taskCount,
        LocalDate startDate,
        LocalDate endDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProjectSummaryResponse from(Project p) {
        return new ProjectSummaryResponse(
                p.getId(),
                p.getTitle(),
                p.getDescription(),
                p.getStatus(),
                p.getOwnerName(),
                p.getMembers().size(),
                p.getTasks().size(),
                p.getStartDate(),
                p.getEndDate(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
