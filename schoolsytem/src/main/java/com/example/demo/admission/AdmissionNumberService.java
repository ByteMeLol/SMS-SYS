package com.example.demo.admission;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class AdmissionNumberService {
    private final AdmissionSequenceRepository admissionSequenceRepository;
    public AdmissionNumberService(AdmissionSequenceRepository admissionSequenceRepository){
        this.admissionSequenceRepository=admissionSequenceRepository;
    }

    @Transactional
    public String generateAdmissionNumber(int year){
        AdmissionSequence sequence=admissionSequenceRepository.findByYear(year).orElseGet(() -> new AdmissionSequence(year,0));
        sequence.setLastNumber(sequence.getLastNumber()+1);
        admissionSequenceRepository.save(sequence);

        return String.format("STD-%d-%04d",year,sequence.getLastNumber());
    }
}
