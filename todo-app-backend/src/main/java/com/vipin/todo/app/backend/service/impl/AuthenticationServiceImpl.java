package com.vipin.todo.app.backend.service.impl;
import com.vipin.todo.app.backend.model.dto.AuthenticationResponseDto;
import com.vipin.todo.app.backend.model.dto.RegisterRequestDto;
import com.vipin.todo.app.backend.model.entity.Role;
import com.vipin.todo.app.backend.model.entity.UserInfo;
import com.vipin.todo.app.backend.repository.UserRepository;
import com.vipin.todo.app.backend.service.AuthenticationService;
import com.vipin.todo.app.backend.service.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
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
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow()  ;
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password provided for username: " + request.getUsername());
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        var jwtToken = jwtService.generateToken(user);
        setCookieInResponse(response,jwtToken);
        return AuthenticationResponseDto
                .builder()
                .username(user.getUsername())
                .build();

    }

    @Override
    public Boolean checkAuthentication(HttpServletRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()
                    || authentication instanceof AnonymousAuthenticationToken) {
                return false;
            }
            log.info("authentication: {}",authentication);
            Cookie[] cookies = request.getCookies();
            if (cookies == null) {
                return false;
            }
            String token = null;
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
            if (token == null) {
                return false;
            }
            log.info("token: {}",token);
            String username = jwtService.extractUsername(token);
            if (username == null) {
                return false;
            }
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (userDetails == null) {
                return false;
            }
            log.info("user: {}",userDetails);
            return jwtService.isTokenValid(token, userDetails);

        } catch (ExpiredJwtException e) {
            return false;
        } catch (JwtException e) {
            return false;
        } catch (Exception e) {
            log.error("Error during authentication check", e);
            return false;
        }
    }

    @Override
    public void handleLogout(HttpServletRequest request, HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("jwt", null);
        jwtCookie.setPath("/");
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setMaxAge(0);
        response.addCookie(jwtCookie);
        HttpSession session = request.getSession(false);
    }

    @Override
    public Long getUserIdFromToken(HttpServletRequest request) {
        String jwt = getJwtFromRequest(request);
        if(jwt == null){
            throw new RuntimeException("Unauthenticated");
        }
        String username = jwtService.extractUsername(jwt);
        var user = userRepository.findByUsername(username).orElse(null);
        if(user != null){
            return user.getId();
        }return null;
    }
    public String getJwtFromRequest(HttpServletRequest request){
        String jwt =null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }return jwt;
    }

    public void setCookieInResponse(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
