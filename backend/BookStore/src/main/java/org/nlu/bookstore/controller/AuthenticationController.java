package org.nlu.bookstore.controller;

import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.*;
import org.nlu.bookstore.dto.response.*;
import org.nlu.bookstore.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping("/login")
    ResponseEntity<ApiResponse<AuthenticationResponse>> login(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        ApiResponse<AuthenticationResponse> apiResponse = ApiResponse.<AuthenticationResponse>builder()
                .data(result)
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping("/introspect")
    ResponseEntity<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        ApiResponse<IntrospectResponse> apiResponse = ApiResponse.<IntrospectResponse>builder()
                .data(result)
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping("/forgot-password")
    ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        ApiResponse<ForgotPasswordResponse> apiResponse = ApiResponse.<ForgotPasswordResponse>builder()
                .data(authenticationService.forgotPassword(request))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping("/verify-otp")
    ResponseEntity<ApiResponse<Boolean>> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        ApiResponse<Boolean> apiResponse = ApiResponse.<Boolean>builder()
                .data(authenticationService.verifyOtp(email, otp))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping("/reset-password")
    ResponseEntity<ApiResponse<UserResponse>> resetPassword(@RequestBody ResetPasswordRequest request) {
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .data(authenticationService.resetPassword(request))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }
}
