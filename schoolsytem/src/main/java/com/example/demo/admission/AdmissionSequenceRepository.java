package com.example.demo.admission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface AdmissionSequenceRepository extends JpaRepository<AdmissionSequence,Long> {

    Optional<AdmissionSequence> findByYear(int year);
}
