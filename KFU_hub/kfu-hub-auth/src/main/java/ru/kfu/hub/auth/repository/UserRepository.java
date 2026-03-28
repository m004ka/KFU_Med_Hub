package ru.kfu.hub.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kfu.hub.auth.entity.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
