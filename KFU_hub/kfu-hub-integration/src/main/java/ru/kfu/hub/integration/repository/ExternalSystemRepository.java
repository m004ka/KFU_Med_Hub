package ru.kfu.hub.integration.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kfu.hub.integration.entity.ExternalSystem;
import ru.kfu.hub.integration.entity.enums.SystemType;

import java.util.List;
import java.util.UUID;

public interface ExternalSystemRepository extends JpaRepository<ExternalSystem, UUID> {

    List<ExternalSystem> findByActive(boolean active);

    List<ExternalSystem> findByTypeAndActive(SystemType type, boolean active);
}
