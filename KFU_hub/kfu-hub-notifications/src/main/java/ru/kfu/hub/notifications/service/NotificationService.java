package ru.kfu.hub.notifications.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kfu.hub.common.exception.KfuHubException;
import ru.kfu.hub.notifications.dto.NotificationResponse;
import ru.kfu.hub.notifications.entity.Notification;
import ru.kfu.hub.notifications.entity.enums.NotificationType;
import ru.kfu.hub.notifications.repository.NotificationRepository;

import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public NotificationResponse create(UUID userId, NotificationType type, String title, String message, String link) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setLink(link);
        return NotificationResponse.from(repository.save(notification));
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getForUser(UUID userId, Boolean unreadOnly, Pageable pageable) {
        if (Boolean.TRUE.equals(unreadOnly)) {
            return repository.findByUserIdAndReadOrderByCreatedAtDesc(userId, false, pageable)
                    .map(NotificationResponse::from);
        }
        return repository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(NotificationResponse::from);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getUnreadCount(UUID userId) {
        return Map.of("count", repository.countByUserIdAndRead(userId, false));
    }

    public NotificationResponse markAsRead(UUID notificationId, UUID userId) {
        Notification notification = repository.findById(notificationId)
                .orElseThrow(() -> new KfuHubException("Уведомление не найдено", HttpStatus.NOT_FOUND));
        if (!notification.getUserId().equals(userId)) {
            throw new KfuHubException("Нет доступа к уведомлению", HttpStatus.FORBIDDEN);
        }
        notification.setRead(true);
        return NotificationResponse.from(repository.save(notification));
    }

    public Map<String, Integer> markAllAsRead(UUID userId) {
        int count = repository.markAllAsRead(userId);
        return Map.of("marked", count);
    }
}
