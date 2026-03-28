package ru.kfu.hub.projects.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kfu.hub.projects.entity.TaskComment;

import java.util.List;
import java.util.UUID;

public interface TaskCommentRepository extends JpaRepository<TaskComment, UUID> {

    List<TaskComment> findByTaskIdOrderByCreatedAtAsc(UUID taskId);
}
