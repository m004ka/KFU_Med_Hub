package ru.kfu.hub.integration.entity;

import jakarta.persistence.*;
import ru.kfu.hub.integration.entity.enums.SyncJobStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sync_jobs", schema = "integration")
public class SyncJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "system_id", nullable = false)
    private ExternalSystem system;

    @Column(name = "resource_type", nullable = false, length = 50)
    private String resourceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SyncJobStatus status;

    @Column(name = "records_processed")
    private Integer recordsProcessed;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = SyncJobStatus.PENDING;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ExternalSystem getSystem() { return system; }
    public void setSystem(ExternalSystem system) { this.system = system; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public SyncJobStatus getStatus() { return status; }
    public void setStatus(SyncJobStatus status) { this.status = status; }
    public Integer getRecordsProcessed() { return recordsProcessed; }
    public void setRecordsProcessed(Integer recordsProcessed) { this.recordsProcessed = recordsProcessed; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
