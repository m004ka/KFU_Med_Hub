package ru.kfu.hub.integration.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kfu.hub.integration.dto.ExternalSystemRequest;
import ru.kfu.hub.integration.dto.ExternalSystemResponse;
import ru.kfu.hub.integration.dto.SyncJobResponse;
import ru.kfu.hub.integration.service.ExternalSystemService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/integration")
public class IntegrationController {

    private final ExternalSystemService service;

    public IntegrationController(ExternalSystemService service) {
        this.service = service;
    }

    @PostMapping("/systems")
    public ResponseEntity<ExternalSystemResponse> create(@Valid @RequestBody ExternalSystemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping("/systems")
    public ResponseEntity<List<ExternalSystemResponse>> listAll(
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        return ResponseEntity.ok(activeOnly ? service.listActive() : service.listAll());
    }

    @GetMapping("/systems/{id}")
    public ResponseEntity<ExternalSystemResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/systems/{id}")
    public ResponseEntity<ExternalSystemResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody ExternalSystemRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PatchMapping("/systems/{id}/toggle")
    public ResponseEntity<ExternalSystemResponse> toggleActive(@PathVariable UUID id) {
        return ResponseEntity.ok(service.toggleActive(id));
    }

    @DeleteMapping("/systems/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/systems/{id}/sync")
    public ResponseEntity<SyncJobResponse> triggerSync(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "Patient") String resourceType) {
        return ResponseEntity.ok(service.triggerSync(id, resourceType));
    }

    @GetMapping("/systems/{id}/jobs")
    public ResponseEntity<Page<SyncJobResponse>> getSyncJobs(
            @PathVariable UUID id,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(service.getSyncJobs(id, pageable));
    }
}
