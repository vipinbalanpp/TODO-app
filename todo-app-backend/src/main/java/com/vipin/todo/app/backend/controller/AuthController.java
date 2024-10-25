package com.vipin.todo.app.backend.controller;
import com.vipin.todo.app.backend.model.dto.AuthenticationResponseDto;
import com.vipin.todo.app.backend.model.dto.RegisterRequestDto;
import com.vipin.todo.app.backend.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping("/check")
    public ResponseEntity<Boolean> authenticationCheck(HttpServletRequest request){
        return new ResponseEntity<>(authenticationService.checkAuthentication(request), HttpStatus.OK);
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ){
        authenticationService.handleLogout(request,response);
        return ResponseEntity.ok("Logout successful");
    }
}
