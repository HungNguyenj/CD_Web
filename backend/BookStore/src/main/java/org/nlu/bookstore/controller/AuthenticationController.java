package org.nlu.bookstore.controller;

import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.ApiResponse;
import org.nlu.bookstore.dto.request.AuthenticationRequest;
import org.nlu.bookstore.dto.request.IntrospectRequest;
import org.nlu.bookstore.dto.response.AuthenticationResponse;
import org.nlu.bookstore.dto.response.IntrospectResponse;
import org.nlu.bookstore.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
