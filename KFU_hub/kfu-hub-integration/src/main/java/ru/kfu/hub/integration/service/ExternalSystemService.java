package ru.kfu.hub.integration.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kfu.hub.common.exception.KfuHubException;
import ru.kfu.hub.integration.dto.ExternalSystemRequest;
import ru.kfu.hub.integration.dto.ExternalSystemResponse;
import ru.kfu.hub.integration.dto.SyncJobResponse;
import ru.kfu.hub.integration.entity.ExternalSystem;
import ru.kfu.hub.integration.entity.SyncJob;
import ru.kfu.hub.integration.entity.enums.SyncJobStatus;
import ru.kfu.hub.integration.repository.ExternalSystemRepository;
import ru.kfu.hub.integration.repository.SyncJobRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExternalSystemService {

    private final ExternalSystemRepository systemRepository;
    private final SyncJobRepository syncJobRepository;

    public ExternalSystemService(ExternalSystemRepository systemRepository, SyncJobRepository syncJobRepository) {
        this.systemRepository = systemRepository;
        this.syncJobRepository = syncJobRepository;
    }

    public ExternalSystemResponse create(ExternalSystemRequest request) {
        ExternalSystem system = new ExternalSystem();
        system.setName(request.name());
        system.setType(request.type());
        system.setEndpoint(request.endpoint());
        system.setAuthToken(request.authToken());
        system.setDescription(request.description());
        return ExternalSystemResponse.from(systemRepository.save(system));
    }

    @Transactional(readOnly = true)
    public ExternalSystemResponse getById(UUID id) {
        return ExternalSystemResponse.from(findById(id));
    }

    @Transactional(readOnly = true)
    public List<ExternalSystemResponse> listAll() {
        return systemRepository.findAll().stream()
                .map(ExternalSystemResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExternalSystemResponse> listActive() {
        return systemRepository.findByActive(true).stream()
                .map(ExternalSystemResponse::from).collect(Collectors.toList());
    }

    public ExternalSystemResponse update(UUID id, ExternalSystemRequest request) {
        ExternalSystem system = findById(id);
        system.setName(request.name());
        system.setType(request.type());
        system.setEndpoint(request.endpoint());
        if (request.authToken() != null) system.setAuthToken(request.authToken());
        system.setDescription(request.description());
        return ExternalSystemResponse.from(systemRepository.save(system));
    }

    public ExternalSystemResponse toggleActive(UUID id) {
        ExternalSystem system = findById(id);
        system.setActive(!system.isActive());
        return ExternalSystemResponse.from(systemRepository.save(system));
    }

    public void delete(UUID id) {
        systemRepository.delete(findById(id));
    }

    public SyncJobResponse triggerSync(UUID systemId, String resourceType) {
        ExternalSystem system = findById(systemId);
        SyncJob job = new SyncJob();
        job.setSystem(system);
        job.setResourceType(resourceType);
        job.setStatus(SyncJobStatus.RUNNING);
        job.setStartedAt(LocalDateTime.now());
        job = syncJobRepository.save(job);

        job.setStatus(SyncJobStatus.COMPLETED);
        job.setRecordsProcessed(0);
        job.setCompletedAt(LocalDateTime.now());
        return SyncJobResponse.from(syncJobRepository.save(job));
    }

    @Transactional(readOnly = true)
    public Page<SyncJobResponse> getSyncJobs(UUID systemId, Pageable pageable) {
        findById(systemId);
        return syncJobRepository.findBySystemId(systemId, pageable).map(SyncJobResponse::from);
    }

    private ExternalSystem findById(UUID id) {
        return systemRepository.findById(id)
                .orElseThrow(() -> new KfuHubException("Внешняя система не найдена", HttpStatus.NOT_FOUND));
    }
}
