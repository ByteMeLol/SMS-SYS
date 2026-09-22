package com.example.demo.student;

import com.example.demo.admission.AdmissionNumberService;
import com.example.demo.student.dto.StudentCreateRequest;
import com.example.demo.student.dto.StudentResponse;
import com.example.demo.student.dto.StudentStatusUpdateRequest;
import com.example.demo.student.dto.StudentUpdateRequest;
import com.example.demo.user.EmailAlreadyExistsException;
import com.example.demo.user.Role;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;


@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final AdmissionNumberService admissionNumberService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    private StudentResponse toStudentResponse( Student student){
        return new StudentResponse(
                student.getId(),
                student.getAdmissionNumber(),
                student.getDateOfBirth(),
                student.getAddress(),
                student.getAdmissionDate(),
                student.getStatus()
        );
    }

    @Value("${school.default.password}")
    private String defaultpassword;

    public StudentService(StudentRepository studentRepository, AdmissionNumberService admissionNumberService,
                          PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.admissionNumberService = admissionNumberService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Transactional
    public StudentResponse createStudent(StudentCreateRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("email already exists");

        }
        int admission_year = request.getAdmissionDate().getYear();

        String admissionNumber = admissionNumberService.generateAdmissionNumber(admission_year);

        String hashedpass = passwordEncoder.encode(defaultpassword);

        User user = new User(
                request.getFirstName(),
                request.getMiddleName(),
                request.getLastName(),
                request.getPhone(),
                request.getEmail(),
                request.getGender(),
                hashedpass,
                Role.STUDENT
        );

        userRepository.save(user);

        Student student = new Student(
                user,
                admissionNumber,
                request.getDateOfBirth(),
                request.getAddress(),
                request.getAdmissionDate(),
                StudentStatus.ACTIVE
        );

        Student savedstudent=studentRepository.save(student);

        return toStudentResponse(savedstudent);
    }
    public StudentResponse getStudentById(Long id){
        Student student=studentRepository.findById(id).orElseThrow(()->new StudentNotFoundException("Student Not found"));
        return toStudentResponse(student);
    }

    public List<StudentResponse> getStudents() {
        return studentRepository.findAll().stream().map(this::toStudentResponse).toList();
    }
    @Transactional
    public StudentResponse updateStudent(
            Long id,
            StudentUpdateRequest request
    ) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found"));

        User user = student.getUser();

        // Check whether the new email belongs to another user
        if (!user.getEmail().equals(request.getEmail())
                && userRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new EmailAlreadyExistsException("Email already exists");
        }

        // Update User account
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setMiddleName(request.getMiddleName());
        user.setLastName(request.getLastName());
        user.setGender(request.getGender());
        user.setPhone(request.getPhone());


        // Update Student information

        student.setDateOfBirth(request.getDateOfBirth());

        student.setAddress(request.getAddress());

        userRepository.save(user);

        Student savedStudent = studentRepository.save(student);

        return toStudentResponse(savedStudent);
    }

    @Transactional
    public StudentResponse updateStudentStatus(
            Long id,
            StudentStatusUpdateRequest request
    ) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException("Student not found")
                );

        student.setStatus(request.getStatus());

        Student savedStudent = studentRepository.save(student);

        return toStudentResponse(savedStudent);
    }


}