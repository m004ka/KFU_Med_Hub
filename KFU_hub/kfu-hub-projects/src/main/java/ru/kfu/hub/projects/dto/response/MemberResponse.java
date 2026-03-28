package ru.kfu.hub.projects.dto.response;

import ru.kfu.hub.projects.entity.ProjectMember;
import ru.kfu.hub.projects.entity.enums.ProjectRole;

import java.time.LocalDateTime;
import java.util.UUID;

public record MemberResponse(
        UUID id,
        UUID userId,
        String userName,
        ProjectRole role,
        LocalDateTime joinedAt
) {
    public static MemberResponse from(ProjectMember m) {
        return new MemberResponse(m.getId(), m.getUserId(), m.getUserName(), m.getRole(), m.getJoinedAt());
    }
}
