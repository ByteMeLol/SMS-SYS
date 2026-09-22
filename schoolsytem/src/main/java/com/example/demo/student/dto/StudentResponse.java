package com.example.demo.student.dto;

import com.example.demo.student.StudentStatus;

import java.time.LocalDate;

public class StudentResponse {

    private Long id;
    private String admissionNumber;



    private LocalDate dateOfBirth;



    private String address;

    private LocalDate admissionDate;

    private StudentStatus status;

    public StudentResponse() {
    }

    public StudentResponse(
            Long id,
            String admissionNumber,

            LocalDate dateOfBirth,

            String address,
            LocalDate admissionDate,
            StudentStatus status
    ) {
        this.id = id;
        this.admissionNumber = admissionNumber;

        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.admissionDate = admissionDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getAdmissionNumber() {
        return admissionNumber;
    }



    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }





    public String getAddress() {
        return address;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public StudentStatus getStatus() {
        return status;
    }
}