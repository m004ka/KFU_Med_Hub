package ru.kfu.hub.projects.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateProjectRequest(
        @NotBlank @Size(max = 255) String title,
        String description,
        LocalDate startDate,
        LocalDate endDate
) {}
