package com.vipin.todo.app.backend.controller;
import com.vipin.todo.app.backend.model.dto.AuthenticationResponseDto;
import com.vipin.todo.app.backend.model.dto.RegisterRequestDto;
import com.vipin.todo.app.backend.service.AuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDto> register(
            @RequestBody RegisterRequestDto request,
            HttpServletResponse response
    ){
        return ResponseEntity.ok(authenticationService.register(request,response));
    }
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponseDto> authenticate(
            @RequestBody RegisterRequestDto request,
            HttpServletResponse response
    ){
        return ResponseEntity.ok(authenticationService.authenticate(request,response));
    }
}
