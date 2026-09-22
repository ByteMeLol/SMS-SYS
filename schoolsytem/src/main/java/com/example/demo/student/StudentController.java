package com.example.demo.student;

import com.example.demo.student.dto.StudentCreateRequest;
import com.example.demo.student.dto.StudentResponse;
import com.example.demo.student.dto.StudentStatusUpdateRequest;
import com.example.demo.student.dto.StudentUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService){
        this.studentService=studentService;
    }

    @PostMapping("/register/student")
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponse createStudent(@Valid  @RequestBody StudentCreateRequest request){
        return studentService.createStudent(request);
    }
    
    @GetMapping("/students/show")
    public List<StudentResponse> getStudents(){
        return studentService.getStudents();
    }
    @GetMapping("/students/{id}")
    public StudentResponse getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }
    @PutMapping("/students/{id}")
    public StudentResponse updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentUpdateRequest request
    ) {
        return studentService.updateStudent(id, request);
    }

    @PatchMapping("/students/{id}/status")
    public StudentResponse updateStudentStatus(
            @PathVariable Long id,
            @Valid @RequestBody StudentStatusUpdateRequest request
    ) {
        return studentService.updateStudentStatus(id, request);
    }

}
