package ru.kfu.hub.dataset.entity;

import jakarta.persistence.*;
import ru.kfu.hub.dataset.entity.enums.DatasetDomain;
import ru.kfu.hub.dataset.entity.enums.DatasetFormat;
import ru.kfu.hub.dataset.entity.enums.DatasetStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "datasets", schema = "datasets")
public class Dataset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private DatasetDomain domain;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DatasetFormat format;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DatasetStatus status;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(name = "owner_name", nullable = false, length = 255)
    private String ownerName;

    @Column(name = "record_count")
    private Long recordCount;

    @Column(name = "storage_key", length = 512)
    private String storageKey;

    @Column(name = "file_name", length = 512)
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "checksum", length = 64)
    private String checksum;

    @Column(name = "license_type", length = 100)
    private String licenseType;

    @Column(nullable = false)
    private Integer version;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "dataset_tags",
            schema = "datasets",
            joinColumns = @JoinColumn(name = "dataset_id")
    )
    @Column(name = "tag", length = 100)
    private Set<String> tags = new HashSet<>();

    @OneToMany(mappedBy = "dataset", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    private List<DatasetVersion> versions = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (version == null) {
            version = 1;
        }
        if (status == null) {
            status = DatasetStatus.DRAFT;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public DatasetDomain getDomain() { return domain; }
    public void setDomain(DatasetDomain domain) { this.domain = domain; }
    public DatasetFormat getFormat() { return format; }
    public void setFormat(DatasetFormat format) { this.format = format; }
    public DatasetStatus getStatus() { return status; }
    public void setStatus(DatasetStatus status) { this.status = status; }
    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public Long getRecordCount() { return recordCount; }
    public void setRecordCount(Long recordCount) { this.recordCount = recordCount; }
    public String getStorageKey() { return storageKey; }
    public void setStorageKey(String storageKey) { this.storageKey = storageKey; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getChecksum() { return checksum; }
    public void setChecksum(String checksum) { this.checksum = checksum; }
    public String getLicenseType() { return licenseType; }
    public void setLicenseType(String licenseType) { this.licenseType = licenseType; }
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }
    public List<DatasetVersion> getVersions() { return versions; }
    public void setVersions(List<DatasetVersion> versions) { this.versions = versions; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
}
