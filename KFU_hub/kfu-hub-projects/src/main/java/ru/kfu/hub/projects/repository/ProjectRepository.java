package ru.kfu.hub.projects.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.kfu.hub.projects.entity.Project;
import ru.kfu.hub.projects.entity.enums.ProjectStatus;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    Page<Project> findByOwnerId(UUID ownerId, Pageable pageable);

    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.members m WHERE m.userId = :userId")
    List<Project> findByMemberUserId(UUID userId);
}
