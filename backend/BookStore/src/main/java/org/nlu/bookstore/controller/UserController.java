package org.nlu.bookstore.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.ApiResponse;
import org.nlu.bookstore.dto.request.UserCreationRequest;
import org.nlu.bookstore.dto.request.UserUpdateRequest;
import org.nlu.bookstore.dto.response.UserResponse;
import org.nlu.bookstore.entity.User;
import org.nlu.bookstore.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    ResponseEntity<ApiResponse<List<UserResponse>>> getUsers() {
        ApiResponse<List<UserResponse>> apiResponse = ApiResponse.<List<UserResponse>>builder()
                .data(userService.getUsers())
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping("/{userId}")
    ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long userId) {
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .data(userService.getUser(userId))
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

    @PutMapping("/{userId}")
    ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long userId, @RequestBody UserUpdateRequest request) {
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .data(userService.updateUser(userId, request))
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

}
