package ru.kfu.hub.projects.exception;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object statusObj = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int statusCode = statusObj != null ? Integer.parseInt(statusObj.toString()) : 500;
        HttpStatus status = HttpStatus.resolve(statusCode);

        Map<String, Object> body = new HashMap<>();
        body.put("status", statusCode);
        body.put("message", status != null ? status.getReasonPhrase() : "Ошибка");
        body.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(statusCode).body(body);
    }
}
