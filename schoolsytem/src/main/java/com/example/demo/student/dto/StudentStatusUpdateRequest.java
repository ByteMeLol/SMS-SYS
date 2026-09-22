package com.example.demo.student.dto;

import com.example.demo.student.StudentStatus;
import jakarta.validation.constraints.NotNull;

public class StudentStatusUpdateRequest {

    @NotNull(message = "Student status is required")
    private StudentStatus status;

    public StudentStatusUpdateRequest() {
    }

    public StudentStatus getStatus() {
        return status;
    }

    public void setStatus(StudentStatus status) {
        this.status = status;
    }
}