package ru.kfu.hub.projects.dto.request;

import jakarta.validation.constraints.Size;
import ru.kfu.hub.projects.entity.enums.ProjectStatus;

import java.time.LocalDate;

public record UpdateProjectRequest(
        @Size(max = 255) String title,
        String description,
        ProjectStatus status,
        LocalDate startDate,
        LocalDate endDate
) {}
