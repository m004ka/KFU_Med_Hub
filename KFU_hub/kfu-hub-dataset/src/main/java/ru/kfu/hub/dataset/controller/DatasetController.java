package ru.kfu.hub.dataset.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.kfu.hub.dataset.dto.request.CreateDatasetRequest;
import ru.kfu.hub.dataset.dto.request.UpdateDatasetRequest;
import ru.kfu.hub.dataset.dto.response.DatasetResponse;
import ru.kfu.hub.dataset.dto.response.DatasetSummaryResponse;
import ru.kfu.hub.dataset.dto.response.DatasetVersionResponse;
import ru.kfu.hub.dataset.entity.enums.DatasetDomain;
import ru.kfu.hub.dataset.service.DatasetService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/datasets")
public class DatasetController {

    private final DatasetService datasetService;

    public DatasetController(DatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @PostMapping
    public ResponseEntity<DatasetResponse> create(
            @Valid @RequestBody CreateDatasetRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Name") String userName) {
        DatasetResponse response = datasetService.createDataset(request, UUID.fromString(userId), userName);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DatasetResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(datasetService.getDataset(id));
    }

    @GetMapping
    public ResponseEntity<Page<DatasetSummaryResponse>> listPublished(
            @RequestParam(required = false) DatasetDomain domain,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(datasetService.listPublished(domain, pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<DatasetSummaryResponse>> listMy(
            @RequestHeader("X-User-Id") String userId,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(datasetService.listMyDatasets(UUID.fromString(userId), pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DatasetResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateDatasetRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(datasetService.updateDataset(id, request, UUID.fromString(userId)));
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<DatasetResponse> publish(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(datasetService.publishDataset(id, UUID.fromString(userId)));
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<DatasetResponse> archive(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(datasetService.archiveDataset(id, UUID.fromString(userId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") String userId) {
        datasetService.deleteDataset(id, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<DatasetResponse> uploadFile(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "changeNote", required = false) String changeNote,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(datasetService.uploadFile(id, file, changeNote, UUID.fromString(userId)));
    }

    @GetMapping("/{id}/versions")
    public ResponseEntity<List<DatasetVersionResponse>> getVersions(@PathVariable UUID id) {
        return ResponseEntity.ok(datasetService.getVersions(id));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Map<String, String>> getDownloadUrl(@PathVariable UUID id) {
        String url = datasetService.getDownloadUrl(id);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
