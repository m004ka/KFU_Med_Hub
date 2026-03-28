package ru.kfu.hub.audit.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kfu.hub.audit.dto.AuditLogResponse;
import ru.kfu.hub.audit.dto.CreateAuditLogRequest;
import ru.kfu.hub.audit.service.AuditService;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @PostMapping
    public ResponseEntity<AuditLogResponse> createLog(@Valid @RequestBody CreateAuditLogRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(auditService.log(request));
    }

    @GetMapping
    public ResponseEntity<Page<AuditLogResponse>> getAll(
            @PageableDefault(size = 50, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(auditService.getAll(pageable));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<AuditLogResponse>> getByUser(
            @PathVariable UUID userId,
            @PageableDefault(size = 50, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(auditService.getByUser(userId, pageable));
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<Page<AuditLogResponse>> getByEntity(
            @PathVariable String entityType,
            @PathVariable String entityId,
            @PageableDefault(size = 50, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(auditService.getByEntity(entityType, entityId, pageable));
    }

    @GetMapping("/range")
    public ResponseEntity<Page<AuditLogResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @PageableDefault(size = 50, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(auditService.getByDateRange(from, to, pageable));
    }
}
