package ru.kfu.hub.projects.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.kfu.hub.projects.entity.Task;
import ru.kfu.hub.projects.entity.enums.TaskStatus;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByProjectIdOrderByPositionAsc(UUID projectId);

    List<Task> findByProjectIdAndStatusOrderByPositionAsc(UUID projectId, TaskStatus status);

    List<Task> findByAssigneeIdOrderByCreatedAtDesc(UUID assigneeId);

    @Query("SELECT COALESCE(MAX(t.position), 0) FROM Task t WHERE t.project.id = :projectId AND t.status = :status")
    Integer findMaxPositionByProjectIdAndStatus(UUID projectId, TaskStatus status);
}
