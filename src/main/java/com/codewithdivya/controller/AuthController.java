package com.codewithdivya.controller;

import com.codewithdivya.dto.LoginRequest;
import com.codewithdivya.dto.LoginResponse;
import com.codewithdivya.dto.RegisterRequest;
import com.codewithdivya.dto.RegisterResponse;
import com.codewithdivya.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {

        this.authenticationService = authenticationService;

    }

    @PostMapping("/login")
    public LoginResponse login(

            @Valid
            @RequestBody LoginRequest request

    ) {

        return authenticationService.login(request);

    }
    @PostMapping("/register")
    public RegisterResponse register(
            @Valid
            @RequestBody RegisterRequest request) {

        return authenticationService.register(request);

    }

}
