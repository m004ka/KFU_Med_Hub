package ru.kfu.hub.ai.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kfu.hub.ai.dto.CreateTaskRequest;
import ru.kfu.hub.ai.dto.TaskResponse;
import ru.kfu.hub.ai.entity.enums.TaskStatus;
import ru.kfu.hub.ai.entity.enums.TaskType;
import ru.kfu.hub.ai.service.AnalysisTaskService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final AnalysisTaskService taskService;

    public AiController(AnalysisTaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(request, UUID.fromString(userId)));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> getTask(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(taskService.getTask(id, UUID.fromString(userId)));
    }

    @GetMapping("/tasks")
    public ResponseEntity<Page<TaskResponse>> getMyTasks(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskType taskType,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(taskService.getMyTasks(UUID.fromString(userId), status, taskType, pageable));
    }

    @PostMapping("/tasks/{id}/cancel")
    public ResponseEntity<TaskResponse> cancelTask(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(taskService.cancelTask(id, UUID.fromString(userId)));
    }

    @GetMapping(value = "/tasks/{id}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<String> streamTaskStatus(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") String userId) {
        TaskResponse task = taskService.getTask(id, UUID.fromString(userId));
        return ResponseEntity.ok("data: " + task.status().name() + " " + task.progress() + "%\n\n");
    }
}
