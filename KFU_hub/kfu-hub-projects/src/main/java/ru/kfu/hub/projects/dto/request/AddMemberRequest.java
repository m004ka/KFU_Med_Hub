package ru.kfu.hub.projects.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ru.kfu.hub.projects.entity.enums.ProjectRole;

import java.util.UUID;

public record AddMemberRequest(
        @NotNull UUID userId,
        @NotBlank String userName,
        @NotNull ProjectRole role
) {}
