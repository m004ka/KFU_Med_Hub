package ru.kfu.hub.dataset.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.kfu.hub.common.exception.KfuHubException;
import ru.kfu.hub.dataset.dto.request.CreateDatasetRequest;
import ru.kfu.hub.dataset.dto.request.UpdateDatasetRequest;
import ru.kfu.hub.dataset.dto.response.DatasetResponse;
import ru.kfu.hub.dataset.dto.response.DatasetSummaryResponse;
import ru.kfu.hub.dataset.dto.response.DatasetVersionResponse;
import ru.kfu.hub.dataset.entity.Dataset;
import ru.kfu.hub.dataset.entity.DatasetVersion;
import ru.kfu.hub.dataset.entity.enums.DatasetDomain;
import ru.kfu.hub.dataset.entity.enums.DatasetStatus;
import ru.kfu.hub.dataset.repository.DatasetRepository;
import ru.kfu.hub.dataset.repository.DatasetVersionRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DatasetService {

    private final DatasetRepository datasetRepository;
    private final DatasetVersionRepository versionRepository;
    private final Optional<StorageService> storageService;

    public DatasetService(DatasetRepository datasetRepository,
                          DatasetVersionRepository versionRepository,
                          Optional<StorageService> storageService) {
        this.datasetRepository = datasetRepository;
        this.versionRepository = versionRepository;
        this.storageService = storageService;
    }

    public DatasetResponse createDataset(CreateDatasetRequest request, UUID ownerId, String ownerName) {
        Dataset dataset = new Dataset();
        dataset.setTitle(request.title());
        dataset.setDescription(request.description());
        dataset.setDomain(request.domain());
        dataset.setFormat(request.format());
        dataset.setRecordCount(request.recordCount());
        dataset.setLicenseType(request.licenseType());
        dataset.setOwnerId(ownerId);
        dataset.setOwnerName(ownerName);
        if (request.tags() != null) {
            dataset.setTags(request.tags());
        }
        return DatasetResponse.from(datasetRepository.save(dataset));
    }

    @Transactional(readOnly = true)
    public DatasetResponse getDataset(UUID id) {
        return DatasetResponse.from(findById(id));
    }

    @Transactional(readOnly = true)
    public Page<DatasetSummaryResponse> listPublished(DatasetDomain domain, Pageable pageable) {
        Page<Dataset> page = domain != null
                ? datasetRepository.findByDomainAndStatus(domain, DatasetStatus.PUBLISHED, pageable)
                : datasetRepository.findByStatus(DatasetStatus.PUBLISHED, pageable);
        return page.map(DatasetSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<DatasetSummaryResponse> listMyDatasets(UUID ownerId, Pageable pageable) {
        return datasetRepository.findByOwnerId(ownerId, pageable).map(DatasetSummaryResponse::from);
    }

    public DatasetResponse updateDataset(UUID id, UpdateDatasetRequest request, UUID userId) {
        Dataset dataset = findById(id);
        checkOwner(dataset, userId);
        if (request.title() != null) dataset.setTitle(request.title());
        if (request.description() != null) dataset.setDescription(request.description());
        if (request.domain() != null) dataset.setDomain(request.domain());
        if (request.format() != null) dataset.setFormat(request.format());
        if (request.recordCount() != null) dataset.setRecordCount(request.recordCount());
        if (request.licenseType() != null) dataset.setLicenseType(request.licenseType());
        if (request.tags() != null) dataset.setTags(request.tags());
        return DatasetResponse.from(datasetRepository.save(dataset));
    }

    public DatasetResponse publishDataset(UUID id, UUID userId) {
        Dataset dataset = findById(id);
        checkOwner(dataset, userId);
        if (dataset.getStatus() != DatasetStatus.DRAFT) {
            throw new KfuHubException("Публикация доступна только для датасетов в статусе DRAFT", HttpStatus.BAD_REQUEST);
        }
        dataset.setStatus(DatasetStatus.PUBLISHED);
        dataset.setPublishedAt(java.time.LocalDateTime.now());
        return DatasetResponse.from(datasetRepository.save(dataset));
    }

    public DatasetResponse archiveDataset(UUID id, UUID userId) {
        Dataset dataset = findById(id);
        checkOwner(dataset, userId);
        dataset.setStatus(DatasetStatus.ARCHIVED);
        return DatasetResponse.from(datasetRepository.save(dataset));
    }

    public void deleteDataset(UUID id, UUID userId) {
        Dataset dataset = findById(id);
        checkOwner(dataset, userId);
        if (dataset.getStorageKey() != null) {
            storageService.ifPresent(s -> s.deleteDataset(dataset.getStorageKey()));
        }
        datasetRepository.delete(dataset);
    }

    public DatasetResponse uploadFile(UUID id, MultipartFile file, String changeNote, UUID userId) {
        Dataset dataset = findById(id);
        checkOwner(dataset, userId);

        String storageKey = storageService
                .map(s -> s.uploadDataset(id, file))
                .orElse("local/" + id + "/" + file.getOriginalFilename());

        int nextVersion = versionRepository
                .findTopByDatasetIdOrderByVersionNumberDesc(id)
                .map(v -> v.getVersionNumber() + 1)
                .orElse(1);

        DatasetVersion version = new DatasetVersion();
        version.setDataset(dataset);
        version.setVersionNumber(nextVersion);
        version.setStorageKey(storageKey);
        version.setFileName(file.getOriginalFilename());
        version.setFileSize(file.getSize());
        version.setCreatedBy(userId);
        version.setChangeNote(changeNote);
        versionRepository.save(version);

        dataset.setStorageKey(storageKey);
        dataset.setFileName(file.getOriginalFilename());
        dataset.setFileSize(file.getSize());
        dataset.setVersion(nextVersion);

        return DatasetResponse.from(datasetRepository.save(dataset));
    }

    @Transactional(readOnly = true)
    public List<DatasetVersionResponse> getVersions(UUID id) {
        findById(id);
        return versionRepository.findByDatasetIdOrderByVersionNumberDesc(id)
                .stream()
                .map(DatasetVersionResponse::from)
                .collect(Collectors.toList());
    }

    public String getDownloadUrl(UUID id) {
        Dataset dataset = findById(id);
        if (dataset.getStorageKey() == null) {
            throw new KfuHubException("Файл ещё не загружен", HttpStatus.NOT_FOUND);
        }
        return storageService
                .map(s -> s.getPresignedDownloadUrl(dataset.getStorageKey()))
                .orElse("http://localhost:9000/" + dataset.getStorageKey());
    }

    private Dataset findById(UUID id) {
        return datasetRepository.findById(id)
                .orElseThrow(() -> new KfuHubException("Датасет не найден", HttpStatus.NOT_FOUND));
    }

    private void checkOwner(Dataset dataset, UUID userId) {
        if (!dataset.getOwnerId().equals(userId)) {
            throw new KfuHubException("Нет прав на изменение этого датасета", HttpStatus.FORBIDDEN);
        }
    }
}
