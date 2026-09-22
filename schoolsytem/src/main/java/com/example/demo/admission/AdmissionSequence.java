package com.example.demo.admission;

import jakarta.persistence.*;

@Entity
@Table(
        name = "admission_sequences",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "year")
        }
)
public class AdmissionSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int year;

    @Column(name = "last_number", nullable = false)
    private int lastNumber;

    public AdmissionSequence() {
    }

    public AdmissionSequence(int year, int lastNumber) {
        this.year = year;
        this.lastNumber = lastNumber;
    }

    public Long getId() {
        return id;
    }

    public int getYear() {
        return year;
    }

    public int getLastNumber() {
        return lastNumber;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setLastNumber(int lastNumber) {
        this.lastNumber = lastNumber;
    }
}