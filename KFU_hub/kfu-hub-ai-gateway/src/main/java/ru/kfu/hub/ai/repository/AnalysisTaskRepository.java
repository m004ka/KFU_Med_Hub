package ru.kfu.hub.ai.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.kfu.hub.ai.entity.AnalysisTask;
import ru.kfu.hub.ai.entity.enums.TaskStatus;
import ru.kfu.hub.ai.entity.enums.TaskType;

import java.util.UUID;

public interface AnalysisTaskRepository extends JpaRepository<AnalysisTask, UUID> {

    Page<AnalysisTask> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<AnalysisTask> findByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, TaskStatus status, Pageable pageable);

    Page<AnalysisTask> findByUserIdAndTaskTypeOrderByCreatedAtDesc(UUID userId, TaskType taskType, Pageable pageable);
}
