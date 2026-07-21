package com.accenture.WebAppVoli.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.accenture.WebAppVoli.dto.UserDto;
import com.accenture.WebAppVoli.enumeration.Role;
import com.accenture.WebAppVoli.model.User;
import com.accenture.WebAppVoli.repository.UserRepository;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveUser(UserDto userDto){
        if(userRepository.findByUsername(userDto.getUsername()).isPresent()){
            throw new com.accenture.WebAppVoli.exception.BadRequestException("Username già presente");
        }
        User user = new User();
        user.setNome(userDto.getNome());
        user.setCognome(userDto.getCognome());
        user.setCf(userDto.getCf());
        user.setIndirizzo(userDto.getIndirizzo());
        user.setRole(Role.USER);
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        return userRepository.save(user);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getUser(Integer id){ // estrarre singolo utente
        return userRepository.findById(id).get();
    }



}
