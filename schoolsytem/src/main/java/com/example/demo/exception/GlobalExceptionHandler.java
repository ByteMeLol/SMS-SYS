package com.example.demo.exception;

import com.example.demo.student.StudentNotFoundException;
import com.example.demo.user.EmailAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(StudentNotFoundException.class)
    public Map<String, Object> handleStudentNotFound(
            StudentNotFoundException exception
    ) {

        return Map.of(
                "status", HttpStatus.NOT_FOUND.value(),
                "message", exception.getMessage(),
                "timestamp", LocalDateTime.now()
        );
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public Map<String, Object> handleEmailAlreadyExists(
            EmailAlreadyExistsException exception
    ) {

        return Map.of(
                "status", HttpStatus.CONFLICT.value(),
                "message", exception.getMessage(),
                "timestamp", LocalDateTime.now()
        );
    }
}