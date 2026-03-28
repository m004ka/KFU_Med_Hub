package ru.kfu.hub.ai.dto;

import ru.kfu.hub.ai.entity.AnalysisTask;
import ru.kfu.hub.ai.entity.enums.TaskStatus;
import ru.kfu.hub.ai.entity.enums.TaskType;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskResponse(
        UUID id,
        UUID userId,
        TaskType taskType,
        TaskStatus status,
        String modelName,
        String inputRef,
        String outputRef,
        String resultJson,
        String errorMessage,
        Integer progress,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime completedAt
) {
    public static TaskResponse from(AnalysisTask t) {
        return new TaskResponse(
                t.getId(), t.getUserId(), t.getTaskType(), t.getStatus(),
                t.getModelName(), t.getInputRef(), t.getOutputRef(),
                t.getResultJson(), t.getErrorMessage(), t.getProgress(),
                t.getCreatedAt(), t.getUpdatedAt(), t.getCompletedAt()
        );
    }
}
