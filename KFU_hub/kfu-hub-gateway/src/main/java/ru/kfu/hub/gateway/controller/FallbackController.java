package ru.kfu.hub.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @RequestMapping("/auth")
    public Mono<ResponseEntity<Map<String, Object>>> authFallback() {
        return fallback("kfu-hub-auth");
    }

    @RequestMapping("/dataset")
    public Mono<ResponseEntity<Map<String, Object>>> datasetFallback() {
        return fallback("kfu-hub-dataset");
    }

    @RequestMapping("/ai")
    public Mono<ResponseEntity<Map<String, Object>>> aiFallback() {
        return fallback("kfu-hub-ai-gateway");
    }

    @RequestMapping("/integration")
    public Mono<ResponseEntity<Map<String, Object>>> integrationFallback() {
        return fallback("kfu-hub-integration");
    }

    @RequestMapping("/projects")
    public Mono<ResponseEntity<Map<String, Object>>> projectsFallback() {
        return fallback("kfu-hub-projects");
    }

    private Mono<ResponseEntity<Map<String, Object>>> fallback(String service) {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "message", "Сервис временно недоступен",
                "service", service,
                "timestamp", LocalDateTime.now().toString()
        )));
    }
}
