package com.example.demo.student;

import com.example.demo.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name="students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="user_id",unique = true)
    private User user;

    @Column(name="admission_number",unique = true,nullable = false)
    private String admissionNumber;



    private LocalDate dateOfBirth;







    private String address;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @Enumerated(EnumType.STRING)
    private StudentStatus status;

    public Student() {
    }

    public Student(
            User user,
            String admissionNumber,

            LocalDate dateOfBirth,


            String address,
            LocalDate admissionDate,
            StudentStatus status
    ) {
        this.user = user;
        this.admissionNumber = admissionNumber;

        this.dateOfBirth = dateOfBirth;


        this.address = address;
        this.admissionDate = admissionDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
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

    public void setUser(User user) {
        this.user = user;
    }

    public void setAdmissionNumber(String admissionNumber) {
        this.admissionNumber = admissionNumber;
    }



    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }






    public void setAddress(String address) {
        this.address = address;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public void setStatus(StudentStatus status) {
        this.status = status;
    }
}


