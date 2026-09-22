package com.example.demo.user;

import com.example.demo.user.dto.UpdateUserDetails;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController

public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService=userService;
    }

    @GetMapping("/users")
    public String users() {
        return "You are authenticated!";
    }

    @PostMapping("/users/register")
    public String createUser(@Valid @RequestBody User requets){
        return userService.creatUser(requets);
    }

    @PutMapping("/user/update/{id}")
    public String updateUser(@Valid @PathVariable Long id, @RequestBody UpdateUserDetails request){
        return userService.updateUserDetails(id,request);
    }

}
