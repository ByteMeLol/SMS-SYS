package com.example.demo.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name= "users")
public class User {
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

    @NotNull(message = "this field is not null")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    protected User() {
    }


    public User(String firstName,String middleName,String lastName,String phone,String email,String gender,String password, Role role) {
        this.firstName=firstName;
        this.middleName=middleName;
        this.lastName=lastName;
        this.phone=phone;
        this.email = email;
        this.gender=gender;
        this.password = password;
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

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
