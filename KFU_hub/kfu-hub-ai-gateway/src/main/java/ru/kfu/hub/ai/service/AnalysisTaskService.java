package ru.kfu.hub.ai.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kfu.hub.ai.dto.CreateTaskRequest;
import ru.kfu.hub.ai.dto.TaskResponse;
import ru.kfu.hub.ai.entity.AnalysisTask;
import ru.kfu.hub.ai.entity.enums.TaskStatus;
import ru.kfu.hub.ai.entity.enums.TaskType;
import ru.kfu.hub.ai.repository.AnalysisTaskRepository;
import ru.kfu.hub.common.exception.KfuHubException;

import java.util.UUID;

@Service
@Transactional
public class AnalysisTaskService {

    private final AnalysisTaskRepository repository;

    public AnalysisTaskService(AnalysisTaskRepository repository) {
        this.repository = repository;
    }

    public TaskResponse createTask(CreateTaskRequest request, UUID userId) {
        AnalysisTask task = new AnalysisTask();
        task.setUserId(userId);
        task.setTaskType(request.taskType());
        task.setModelName(request.modelName());
        task.setInputRef(request.inputRef());
        return TaskResponse.from(repository.save(task));
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(UUID taskId, UUID userId) {
        AnalysisTask task = findById(taskId);
        if (!task.getUserId().equals(userId)) {
            throw new KfuHubException("Нет доступа к задаче", HttpStatus.FORBIDDEN);
        }
        return TaskResponse.from(task);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getMyTasks(UUID userId, TaskStatus status, TaskType taskType, Pageable pageable) {
        if (status != null) {
            return repository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status, pageable)
                    .map(TaskResponse::from);
        }
        if (taskType != null) {
            return repository.findByUserIdAndTaskTypeOrderByCreatedAtDesc(userId, taskType, pageable)
                    .map(TaskResponse::from);
        }
        return repository.findByUserIdOrderByCreatedAtDesc(userId, pageable).map(TaskResponse::from);
    }

    public TaskResponse cancelTask(UUID taskId, UUID userId) {
        AnalysisTask task = findById(taskId);
        if (!task.getUserId().equals(userId)) {
            throw new KfuHubException("Нет доступа к задаче", HttpStatus.FORBIDDEN);
        }
        if (task.getStatus() != TaskStatus.QUEUED) {
            throw new KfuHubException("Отменить можно только задачи в статусе QUEUED", HttpStatus.BAD_REQUEST);
        }
        task.setStatus(TaskStatus.CANCELLED);
        return TaskResponse.from(repository.save(task));
    }

    private AnalysisTask findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new KfuHubException("Задача не найдена", HttpStatus.NOT_FOUND));
    }
}
