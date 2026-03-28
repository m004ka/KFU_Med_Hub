package ru.kfu.hub.projects.dto.response;

import ru.kfu.hub.projects.entity.Project;
import ru.kfu.hub.projects.entity.enums.ProjectStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ProjectResponse(
        UUID id,
        String title,
        String description,
        ProjectStatus status,
        UUID ownerId,
        String ownerName,
        LocalDate startDate,
        LocalDate endDate,
        List<MemberResponse> members,
        List<TaskResponse> tasks,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProjectResponse from(Project p) {
        return new ProjectResponse(
                p.getId(),
                p.getTitle(),
                p.getDescription(),
                p.getStatus(),
                p.getOwnerId(),
                p.getOwnerName(),
                p.getStartDate(),
                p.getEndDate(),
                p.getMembers().stream().map(MemberResponse::from).collect(Collectors.toList()),
                p.getTasks().stream().map(TaskResponse::from).collect(Collectors.toList()),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
