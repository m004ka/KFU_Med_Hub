package ru.kfu.hub.common.exception;

import org.springframework.http.HttpStatus;

public class KfuHubException extends RuntimeException {

    private final HttpStatus status;

    public KfuHubException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
