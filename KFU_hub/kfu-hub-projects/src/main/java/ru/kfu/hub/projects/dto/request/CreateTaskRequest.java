package ru.kfu.hub.projects.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import ru.kfu.hub.projects.entity.enums.TaskPriority;

import java.time.LocalDate;
import java.util.UUID;

public record CreateTaskRequest(
        @NotBlank @Size(max = 255) String title,
        String description,
        TaskPriority priority,
        UUID assigneeId,
        String assigneeName,
        LocalDate dueDate
) {}
