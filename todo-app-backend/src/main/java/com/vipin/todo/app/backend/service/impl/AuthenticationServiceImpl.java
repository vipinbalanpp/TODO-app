package com.vipin.todo.app.backend.service.impl;

import com.vipin.todo.app.backend.model.dto.AuthenticationResponseDto;
import com.vipin.todo.app.backend.model.dto.RegisterRequestDto;
import com.vipin.todo.app.backend.model.entity.Role;
import com.vipin.todo.app.backend.model.entity.UserInfo;
import com.vipin.todo.app.backend.repository.UserRepository;
import com.vipin.todo.app.backend.service.AuthenticationService;
import com.vipin.todo.app.backend.service.JwtService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    @Override
    public AuthenticationResponseDto register(RegisterRequestDto request,HttpServletResponse response) {
        if(userRepository.existsByUsername(request.getUsername())){
            throw  new EntityExistsException("Username Exists");
        }
        var user = UserInfo
                .builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        setCookieInResponse(response,jwtToken);
        return AuthenticationResponseDto
                .builder()
                .username(user.getUsername())
                .build();
    }

    @Override
    public AuthenticationResponseDto authenticate(RegisterRequestDto request,HttpServletResponse response) {
        if(!userRepository.existsByUsername(request.getUsername())){
            throw new EntityNotFoundException("User not found with username: "+request.getPassword());
        }
        if (!passwordEncoder.matches(request.getPassword(), request.getPassword())) {
            throw new IllegalArgumentException("Invalid password provided for username: " + request.getUsername());
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow()  ;
        var jwtToken = jwtService.generateToken(user);
        setCookieInResponse(response,jwtToken);
        return AuthenticationResponseDto
                .builder()
                .username(user.getUsername())
                .build();

    }

    public void setCookieInResponse(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
