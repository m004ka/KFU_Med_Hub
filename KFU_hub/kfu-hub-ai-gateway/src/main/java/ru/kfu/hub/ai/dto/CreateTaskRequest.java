package ru.kfu.hub.ai.dto;

import jakarta.validation.constraints.NotNull;
import ru.kfu.hub.ai.entity.enums.TaskType;

public record CreateTaskRequest(
        @NotNull TaskType taskType,
        String modelName,
        String inputRef,
        String parameters
) {}
