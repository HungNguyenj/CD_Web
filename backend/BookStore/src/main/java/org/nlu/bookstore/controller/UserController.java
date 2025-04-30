package org.nlu.bookstore.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.ApiResponse;
import org.nlu.bookstore.dto.request.UserCreationRequest;
import org.nlu.bookstore.dto.response.UserResponse;
import org.nlu.bookstore.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @PostMapping
    ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody UserCreationRequest request) {
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .data(userService.createUser(request))
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

}
