package org.nlu.bookstore.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.ApiResponse;
import org.nlu.bookstore.dto.request.PaymentRequest;
import org.nlu.bookstore.dto.response.PaymentResponse;
import org.nlu.bookstore.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {

    PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PaymentResponse>> create(@RequestBody PaymentRequest request) {
        ApiResponse<PaymentResponse> apiResponse = ApiResponse.<PaymentResponse>builder()
                .data(paymentService.processPayment(request))
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
        ApiResponse<List<PaymentResponse>> apiResponse = ApiResponse.<List<PaymentResponse>>builder()
                .data(paymentService.getAllPayments())
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getUserPayments() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();
        ApiResponse<List<PaymentResponse>> apiResponse = ApiResponse.<List<PaymentResponse>>builder()
                .data(paymentService.getPaymentsByUserName(username))
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
