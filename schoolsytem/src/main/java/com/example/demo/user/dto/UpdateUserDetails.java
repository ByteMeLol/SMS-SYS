package com.example.demo.user.dto;

import com.example.demo.user.Role;
import com.example.demo.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name= "users")
public class UpdateUserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "this field is never empty")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotNull(message = "this field is not null")
    @Column(name = "middle_name")
    private String middleName;

    @NotNull(message = "this field is not null")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotNull(message = "this field is not null")
    private String gender;

    @NotNull(message = "this field is not null")
    private String phone;

    @NotNull(message = "this field is not null")
    private String email;



    @Enumerated(EnumType.STRING)
    private Role role;

    protected UpdateUserDetails() {
    }


    public UpdateUserDetails(String firstName, String middleName, String lastName, String phone, String email, String gender) {
        this.firstName=firstName;
        this.middleName=middleName;
        this.lastName=lastName;
        this.phone=phone;
        this.email = email;
        this.gender=gender;
        this.role = role;

    }


    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }



    public String getEmail() {
        return email;
    }


    public Role getRole() {
        return role;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public void setRole(Role role) {
        this.role = role;
    }
}
