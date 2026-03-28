package ru.kfu.hub.dataset.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.kfu.hub.dataset.entity.Dataset;
import ru.kfu.hub.dataset.entity.enums.DatasetDomain;
import ru.kfu.hub.dataset.entity.enums.DatasetStatus;

import java.util.UUID;

public interface DatasetRepository extends JpaRepository<Dataset, UUID> {

    Page<Dataset> findByStatus(DatasetStatus status, Pageable pageable);

    Page<Dataset> findByOwnerId(UUID ownerId, Pageable pageable);

    Page<Dataset> findByDomainAndStatus(DatasetDomain domain, DatasetStatus status, Pageable pageable);

    Page<Dataset> findByStatusIn(java.util.List<DatasetStatus> statuses, Pageable pageable);
}
