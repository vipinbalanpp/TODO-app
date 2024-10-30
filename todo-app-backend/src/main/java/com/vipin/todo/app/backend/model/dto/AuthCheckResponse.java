package com.vipin.todo.app.backend.model.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthCheckResponse {
    private Boolean isLoggedIn;
    private AuthenticationResponseDto user;
}
