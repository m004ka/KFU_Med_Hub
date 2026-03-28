package ru.kfu.hub.projects.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kfu.hub.projects.dto.request.CreateCommentRequest;
import ru.kfu.hub.projects.dto.request.CreateTaskRequest;
import ru.kfu.hub.projects.dto.request.MoveTaskRequest;
import ru.kfu.hub.projects.dto.request.UpdateTaskRequest;
import ru.kfu.hub.projects.dto.response.CommentResponse;
import ru.kfu.hub.projects.dto.response.TaskResponse;
import ru.kfu.hub.projects.entity.enums.TaskStatus;
import ru.kfu.hub.projects.service.TaskService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateTaskRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(projectId, request, UUID.fromString(userId)));
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> getProjectTasks(
            @PathVariable UUID projectId,
            @RequestParam(required = false) TaskStatus status) {
        if (status != null) {
            return ResponseEntity.ok(taskService.getProjectTasksByStatus(projectId, status));
        }
        return ResponseEntity.ok(taskService.getProjectTasks(projectId));
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable UUID taskId) {
        return ResponseEntity.ok(taskService.getTask(taskId));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable UUID taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(taskService.updateTask(taskId, request, UUID.fromString(userId)));
    }

    @PatchMapping("/tasks/{taskId}/move")
    public ResponseEntity<TaskResponse> moveTask(
            @PathVariable UUID taskId,
            @Valid @RequestBody MoveTaskRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(taskService.moveTask(taskId, request, UUID.fromString(userId)));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID taskId,
            @RequestHeader("X-User-Id") String userId) {
        taskService.deleteTask(taskId, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/tasks/{taskId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable UUID taskId,
            @Valid @RequestBody CreateCommentRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Name") String userName) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.addComment(taskId, request, UUID.fromString(userId), userName));
    }

    @DeleteMapping("/tasks/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable UUID commentId,
            @RequestHeader("X-User-Id") String userId) {
        taskService.deleteComment(commentId, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }
}
