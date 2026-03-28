package ru.kfu.hub.projects.dto.request;

import jakarta.validation.constraints.Size;
import ru.kfu.hub.projects.entity.enums.TaskPriority;
import ru.kfu.hub.projects.entity.enums.TaskStatus;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateTaskRequest(
        @Size(max = 255) String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        UUID assigneeId,
        String assigneeName,
        LocalDate dueDate
) {}
