package ru.kfu.hub.dataset.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kfu.hub.dataset.entity.DatasetVersion;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DatasetVersionRepository extends JpaRepository<DatasetVersion, UUID> {

    List<DatasetVersion> findByDatasetIdOrderByVersionNumberDesc(UUID datasetId);

    Optional<DatasetVersion> findByDatasetIdAndVersionNumber(UUID datasetId, Integer versionNumber);

    Optional<DatasetVersion> findTopByDatasetIdOrderByVersionNumberDesc(UUID datasetId);
}
