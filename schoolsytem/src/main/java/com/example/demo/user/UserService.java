package com.example.demo.user;

import com.example.demo.user.dto.RegisterRequest;
import com.example.demo.user.dto.UpdateUserDetails;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password4j.BcryptPassword4jPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private UpdateUserDetails updateUserDetails(User user){
        return new UpdateUserDetails(
                user.getFirstName(),
                user.getMiddleName(),
                user.getLastName(),
                user.getPhone(),
                user.getEmail(),
                user.getGender()
        );

    }

    

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository=userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String creatUser(User request){
        //checking the emails
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new EmailAlreadyExistsException("email already exist");
        }

        String hashedpass=passwordEncoder.encode(request.getPassword());

        User user =new User(
                request.getFirstName(),
                request.getMiddleName(),
                request.getLastName(),
                request.getPhone(),
                request.getEmail(),
                request.getGender(),
                hashedpass,
                Role.ADMIN
        );


        userRepository.save(user);

        return "user r4egistered success fully";

    }

    public String getUsers(){
        return userRepository.findAll().toString();
    }

    public String updateUserDetails(Long id,UpdateUserDetails request){
        User user=userRepository.findById(id).orElseThrow(()->
                new UserNotFoundException("user not found"));

        user.setFirstName(request.getFirstName());
        user.setMiddleName(request.getMiddleName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setEmail(request.getEmail());

        User upadatedUser= userRepository.save(user);
        return "user updated successfully";


    }


}
