package ru.kfu.hub.projects.dto.response;

import ru.kfu.hub.projects.entity.TaskComment;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommentResponse(
        UUID id,
        UUID authorId,
        String authorName,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CommentResponse from(TaskComment c) {
        return new CommentResponse(c.getId(), c.getAuthorId(), c.getAuthorName(),
                c.getContent(), c.getCreatedAt(), c.getUpdatedAt());
    }
}
