package ru.kfu.hub.projects.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kfu.hub.common.exception.KfuHubException;
import ru.kfu.hub.projects.dto.request.AddMemberRequest;
import ru.kfu.hub.projects.dto.request.CreateProjectRequest;
import ru.kfu.hub.projects.dto.request.UpdateProjectRequest;
import ru.kfu.hub.projects.dto.response.MemberResponse;
import ru.kfu.hub.projects.dto.response.ProjectResponse;
import ru.kfu.hub.projects.dto.response.ProjectSummaryResponse;
import ru.kfu.hub.projects.entity.Project;
import ru.kfu.hub.projects.entity.ProjectMember;
import ru.kfu.hub.projects.entity.enums.ProjectRole;
import ru.kfu.hub.projects.repository.ProjectMemberRepository;
import ru.kfu.hub.projects.repository.ProjectRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;

    public ProjectService(ProjectRepository projectRepository, ProjectMemberRepository memberRepository) {
        this.projectRepository = projectRepository;
        this.memberRepository = memberRepository;
    }

    public ProjectResponse createProject(CreateProjectRequest request, UUID ownerId, String ownerName) {
        Project project = new Project();
        project.setTitle(request.title());
        project.setDescription(request.description());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.setOwnerId(ownerId);
        project.setOwnerName(ownerName);
        project = projectRepository.save(project);

        ProjectMember owner = new ProjectMember();
        owner.setProject(project);
        owner.setUserId(ownerId);
        owner.setUserName(ownerName);
        owner.setRole(ProjectRole.OWNER);
        memberRepository.save(owner);

        return ProjectResponse.from(projectRepository.findById(project.getId()).orElseThrow());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(UUID id) {
        return ProjectResponse.from(findById(id));
    }

    @Transactional(readOnly = true)
    public Page<ProjectSummaryResponse> listMyProjects(UUID userId, Pageable pageable) {
        return projectRepository.findByOwnerId(userId, pageable).map(ProjectSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public List<ProjectSummaryResponse> listMemberProjects(UUID userId) {
        return projectRepository.findByMemberUserId(userId)
                .stream().map(ProjectSummaryResponse::from).collect(Collectors.toList());
    }

    public ProjectResponse updateProject(UUID id, UpdateProjectRequest request, UUID userId) {
        Project project = findById(id);
        checkOwnerOrMember(project, userId, ProjectRole.OWNER);
        if (request.title() != null) project.setTitle(request.title());
        if (request.description() != null) project.setDescription(request.description());
        if (request.status() != null) project.setStatus(request.status());
        if (request.startDate() != null) project.setStartDate(request.startDate());
        if (request.endDate() != null) project.setEndDate(request.endDate());
        return ProjectResponse.from(projectRepository.save(project));
    }

    public void deleteProject(UUID id, UUID userId) {
        Project project = findById(id);
        if (!project.getOwnerId().equals(userId)) {
            throw new KfuHubException("Только владелец может удалить проект", HttpStatus.FORBIDDEN);
        }
        projectRepository.delete(project);
    }

    public MemberResponse addMember(UUID projectId, AddMemberRequest request, UUID requesterId) {
        Project project = findById(projectId);
        checkOwnerOrMember(project, requesterId, ProjectRole.OWNER);
        if (memberRepository.existsByProjectIdAndUserId(projectId, request.userId())) {
            throw new KfuHubException("Пользователь уже является участником проекта", HttpStatus.CONFLICT);
        }
        ProjectMember member = new ProjectMember();
        member.setProject(project);
        member.setUserId(request.userId());
        member.setUserName(request.userName());
        member.setRole(request.role());
        return MemberResponse.from(memberRepository.save(member));
    }

    public void removeMember(UUID projectId, UUID memberId, UUID requesterId) {
        Project project = findById(projectId);
        checkOwnerOrMember(project, requesterId, ProjectRole.OWNER);
        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, memberId)
                .orElseThrow(() -> new KfuHubException("Участник не найден", HttpStatus.NOT_FOUND));
        if (member.getRole() == ProjectRole.OWNER) {
            throw new KfuHubException("Нельзя удалить владельца проекта", HttpStatus.BAD_REQUEST);
        }
        memberRepository.delete(member);
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> getMembers(UUID projectId) {
        findById(projectId);
        return memberRepository.findByProjectId(projectId)
                .stream().map(MemberResponse::from).collect(Collectors.toList());
    }

    private Project findById(UUID id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new KfuHubException("Проект не найден", HttpStatus.NOT_FOUND));
    }

    private void checkOwnerOrMember(Project project, UUID userId, ProjectRole requiredRole) {
        boolean isMember = project.getMembers().stream()
                .anyMatch(m -> m.getUserId().equals(userId) &&
                        (m.getRole() == ProjectRole.OWNER || m.getRole().ordinal() <= requiredRole.ordinal()));
        if (!isMember && !project.getOwnerId().equals(userId)) {
            throw new KfuHubException("Нет прав для этого действия", HttpStatus.FORBIDDEN);
        }
    }
}
