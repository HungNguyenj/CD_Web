package org.nlu.bookstore.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.nlu.bookstore.dto.request.ApiResponse;
import org.nlu.bookstore.dto.request.UserCreationRequest;
import org.nlu.bookstore.dto.request.UserUpdateRequest;
import org.nlu.bookstore.dto.response.UserResponse;
import org.nlu.bookstore.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {

    UserService userService;

    @PostMapping
    ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody @Valid UserCreationRequest request) {
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .data(userService.createUser(request))
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping
    ResponseEntity<ApiResponse<List<UserResponse>>> getUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: {}", authentication.getName());
        authentication.getAuthorities().forEach(
                grantedAuthority -> log.info("GrantedAuthority: {}", grantedAuthority.getAuthority()));

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

    @DeleteMapping("/{userId}")
    ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().body(ApiResponse.<Void>builder().build());
    }

    @GetMapping("/my-profile")
    ResponseEntity<ApiResponse<UserResponse>> getMyProfile() {
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .data(userService.getMyInfo())
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

}
