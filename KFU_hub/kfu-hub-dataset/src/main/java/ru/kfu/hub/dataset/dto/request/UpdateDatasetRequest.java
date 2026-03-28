package ru.kfu.hub.dataset.dto.request;

import jakarta.validation.constraints.Size;
import ru.kfu.hub.dataset.entity.enums.DatasetDomain;
import ru.kfu.hub.dataset.entity.enums.DatasetFormat;

import java.util.Set;

public record UpdateDatasetRequest(
        @Size(max = 255) String title,
        String description,
        DatasetDomain domain,
        DatasetFormat format,
        Long recordCount,
        String licenseType,
        Set<String> tags
) {}
