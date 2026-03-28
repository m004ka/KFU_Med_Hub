package ru.kfu.hub.projects.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kfu.hub.projects.dto.request.AddMemberRequest;
import ru.kfu.hub.projects.dto.request.CreateProjectRequest;
import ru.kfu.hub.projects.dto.request.UpdateProjectRequest;
import ru.kfu.hub.projects.dto.response.MemberResponse;
import ru.kfu.hub.projects.dto.response.ProjectResponse;
import ru.kfu.hub.projects.dto.response.ProjectSummaryResponse;
import ru.kfu.hub.projects.service.ProjectService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(
            @Valid @RequestBody CreateProjectRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Name") String userName) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(request, UUID.fromString(userId), userName));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<ProjectSummaryResponse>> listMy(
            @RequestHeader("X-User-Id") String userId,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(projectService.listMyProjects(UUID.fromString(userId), pageable));
    }

    @GetMapping("/member")
    public ResponseEntity<List<ProjectSummaryResponse>> listMember(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(projectService.listMemberProjects(UUID.fromString(userId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProjectRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(projectService.updateProject(id, request, UUID.fromString(userId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") String userId) {
        projectService.deleteProject(id, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<MemberResponse>> getMembers(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getMembers(id));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<MemberResponse> addMember(
            @PathVariable UUID id,
            @Valid @RequestBody AddMemberRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.addMember(id, request, UUID.fromString(userId)));
    }

    @DeleteMapping("/{id}/members/{memberId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID id,
            @PathVariable UUID memberId,
            @RequestHeader("X-User-Id") String userId) {
        projectService.removeMember(id, memberId, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }
}
