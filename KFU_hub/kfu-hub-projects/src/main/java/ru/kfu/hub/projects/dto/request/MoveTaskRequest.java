package ru.kfu.hub.projects.dto.request;

import jakarta.validation.constraints.NotNull;
import ru.kfu.hub.projects.entity.enums.TaskStatus;

public record MoveTaskRequest(
        @NotNull TaskStatus status,
        @NotNull Integer position
) {}
