package ru.kfu.hub.integration.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import ru.kfu.hub.integration.entity.enums.SystemType;

public record ExternalSystemRequest(
        @NotBlank @Size(max = 255) String name,
        @NotNull SystemType type,
        @NotBlank @Size(max = 512) String endpoint,
        String authToken,
        String description
) {}
