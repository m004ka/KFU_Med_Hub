package ru.kfu.hub.audit.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kfu.hub.audit.dto.AuditLogResponse;
import ru.kfu.hub.audit.dto.CreateAuditLogRequest;
import ru.kfu.hub.audit.entity.AuditLog;
import ru.kfu.hub.audit.repository.AuditLogRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class AuditService {

    private final AuditLogRepository repository;

    public AuditService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public AuditLogResponse log(CreateAuditLogRequest request) {
        AuditLog log = new AuditLog();
        log.setUserId(request.userId());
        log.setUserName(request.userName());
        log.setAction(request.action());
        log.setEntityType(request.entityType());
        log.setEntityId(request.entityId());
        log.setDetails(request.details());
        log.setIpAddress(request.ipAddress());
        return AuditLogResponse.from(repository.save(log));
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(AuditLogResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getByUser(UUID userId, Pageable pageable) {
        return repository.findByUserId(userId, pageable).map(AuditLogResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getByEntity(String entityType, String entityId, Pageable pageable) {
        return repository.findByEntityTypeAndEntityId(entityType, entityId, pageable).map(AuditLogResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getByDateRange(LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return repository.findByCreatedAtBetween(from, to, pageable).map(AuditLogResponse::from);
    }
}
