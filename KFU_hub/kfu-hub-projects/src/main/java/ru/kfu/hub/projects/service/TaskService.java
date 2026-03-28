package ru.kfu.hub.projects.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kfu.hub.common.exception.KfuHubException;
import ru.kfu.hub.projects.dto.request.CreateCommentRequest;
import ru.kfu.hub.projects.dto.request.CreateTaskRequest;
import ru.kfu.hub.projects.dto.request.MoveTaskRequest;
import ru.kfu.hub.projects.dto.request.UpdateTaskRequest;
import ru.kfu.hub.projects.dto.response.CommentResponse;
import ru.kfu.hub.projects.dto.response.TaskResponse;
import ru.kfu.hub.projects.entity.Project;
import ru.kfu.hub.projects.entity.Task;
import ru.kfu.hub.projects.entity.TaskComment;
import ru.kfu.hub.projects.entity.enums.ProjectRole;
import ru.kfu.hub.projects.entity.enums.TaskStatus;
import ru.kfu.hub.projects.repository.ProjectMemberRepository;
import ru.kfu.hub.projects.repository.ProjectRepository;
import ru.kfu.hub.projects.repository.TaskCommentRepository;
import ru.kfu.hub.projects.repository.TaskRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskCommentRepository commentRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;

    public TaskService(TaskRepository taskRepository, TaskCommentRepository commentRepository,
                       ProjectRepository projectRepository, ProjectMemberRepository memberRepository) {
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
        this.projectRepository = projectRepository;
        this.memberRepository = memberRepository;
    }

    public TaskResponse createTask(UUID projectId, CreateTaskRequest request, UUID userId) {
        Project project = findProject(projectId);
        checkAccess(projectId, userId);

        Integer maxPos = taskRepository.findMaxPositionByProjectIdAndStatus(projectId, TaskStatus.TODO);

        Task task = new Task();
        task.setProject(project);
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setPriority(request.priority() != null ? request.priority() : ru.kfu.hub.projects.entity.enums.TaskPriority.MEDIUM);
        task.setAssigneeId(request.assigneeId());
        task.setAssigneeName(request.assigneeName());
        task.setDueDate(request.dueDate());
        task.setCreatedBy(userId);
        task.setPosition(maxPos + 1);

        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getProjectTasks(UUID projectId) {
        findProject(projectId);
        return taskRepository.findByProjectIdOrderByPositionAsc(projectId)
                .stream().map(TaskResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getProjectTasksByStatus(UUID projectId, TaskStatus status) {
        findProject(projectId);
        return taskRepository.findByProjectIdAndStatusOrderByPositionAsc(projectId, status)
                .stream().map(TaskResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(UUID taskId) {
        return TaskResponse.from(findTask(taskId));
    }

    public TaskResponse updateTask(UUID taskId, UpdateTaskRequest request, UUID userId) {
        Task task = findTask(taskId);
        checkAccess(task.getProject().getId(), userId);

        if (request.title() != null) task.setTitle(request.title());
        if (request.description() != null) task.setDescription(request.description());
        if (request.status() != null) task.setStatus(request.status());
        if (request.priority() != null) task.setPriority(request.priority());
        if (request.assigneeId() != null) task.setAssigneeId(request.assigneeId());
        if (request.assigneeName() != null) task.setAssigneeName(request.assigneeName());
        if (request.dueDate() != null) task.setDueDate(request.dueDate());

        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse moveTask(UUID taskId, MoveTaskRequest request, UUID userId) {
        Task task = findTask(taskId);
        checkAccess(task.getProject().getId(), userId);
        task.setStatus(request.status());
        task.setPosition(request.position());
        return TaskResponse.from(taskRepository.save(task));
    }

    public void deleteTask(UUID taskId, UUID userId) {
        Task task = findTask(taskId);
        checkAccess(task.getProject().getId(), userId);
        taskRepository.delete(task);
    }

    public CommentResponse addComment(UUID taskId, CreateCommentRequest request, UUID userId, String userName) {
        Task task = findTask(taskId);
        checkAccess(task.getProject().getId(), userId);

        TaskComment comment = new TaskComment();
        comment.setTask(task);
        comment.setAuthorId(userId);
        comment.setAuthorName(userName);
        comment.setContent(request.content());

        return CommentResponse.from(commentRepository.save(comment));
    }

    public void deleteComment(UUID commentId, UUID userId) {
        TaskComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new KfuHubException("Комментарий не найден", HttpStatus.NOT_FOUND));
        if (!comment.getAuthorId().equals(userId)) {
            throw new KfuHubException("Нет прав на удаление этого комментария", HttpStatus.FORBIDDEN);
        }
        commentRepository.delete(comment);
    }

    private Task findTask(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new KfuHubException("Задача не найдена", HttpStatus.NOT_FOUND));
    }

    private Project findProject(UUID id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new KfuHubException("Проект не найден", HttpStatus.NOT_FOUND));
    }

    private void checkAccess(UUID projectId, UUID userId) {
        Project project = findProject(projectId);
        boolean isOwner = project.getOwnerId().equals(userId);
        boolean isMember = memberRepository.findByProjectIdAndUserId(projectId, userId)
                .map(m -> m.getRole() != ProjectRole.VIEWER)
                .orElse(false);
        if (!isOwner && !isMember) {
            throw new KfuHubException("Нет доступа к проекту", HttpStatus.FORBIDDEN);
        }
    }
}
