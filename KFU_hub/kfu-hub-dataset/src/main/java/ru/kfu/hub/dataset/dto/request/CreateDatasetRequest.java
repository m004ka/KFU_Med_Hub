package ru.kfu.hub.dataset.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import ru.kfu.hub.dataset.entity.enums.DatasetDomain;
import ru.kfu.hub.dataset.entity.enums.DatasetFormat;

import java.util.Set;

public record CreateDatasetRequest(
        @NotBlank @Size(max = 255) String title,
        String description,
        @NotNull DatasetDomain domain,
        @NotNull DatasetFormat format,
        Long recordCount,
        String licenseType,
        Set<String> tags
) {}
