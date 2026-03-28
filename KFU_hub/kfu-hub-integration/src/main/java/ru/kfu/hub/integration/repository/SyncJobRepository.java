package ru.kfu.hub.integration.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.kfu.hub.integration.entity.SyncJob;
import ru.kfu.hub.integration.entity.enums.SyncJobStatus;

import java.util.UUID;

public interface SyncJobRepository extends JpaRepository<SyncJob, UUID> {

    Page<SyncJob> findBySystemId(UUID systemId, Pageable pageable);

    Page<SyncJob> findByStatus(SyncJobStatus status, Pageable pageable);
}
