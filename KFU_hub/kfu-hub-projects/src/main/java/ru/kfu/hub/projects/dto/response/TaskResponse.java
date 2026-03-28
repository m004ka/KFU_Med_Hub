package ru.kfu.hub.projects.dto.response;

import ru.kfu.hub.projects.entity.Task;
import ru.kfu.hub.projects.entity.enums.TaskPriority;
import ru.kfu.hub.projects.entity.enums.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record TaskResponse(
        UUID id,
        UUID projectId,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        UUID assigneeId,
        String assigneeName,
        LocalDate dueDate,
        Integer position,
        UUID createdBy,
        List<CommentResponse> comments,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TaskResponse from(Task t) {
        return new TaskResponse(
                t.getId(),
                t.getProject().getId(),
                t.getTitle(),
                t.getDescription(),
                t.getStatus(),
                t.getPriority(),
                t.getAssigneeId(),
                t.getAssigneeName(),
                t.getDueDate(),
                t.getPosition(),
                t.getCreatedBy(),
                t.getComments().stream().map(CommentResponse::from).collect(Collectors.toList()),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}
