package org.nlu.bookstore.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.ApiResponse;
import org.nlu.bookstore.dto.request.OrderRequest;
import org.nlu.bookstore.dto.request.OrderStatusUpdateRequest;
import org.nlu.bookstore.dto.response.OrderDetailResponse;
import org.nlu.bookstore.dto.response.OrderResponse;
import org.nlu.bookstore.service.OrderItemService;
import org.nlu.bookstore.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {

    OrderService orderService;
    OrderItemService orderItemService;

    @PostMapping()
    ResponseEntity<ApiResponse<OrderResponse>> createOrderFromCart(@RequestBody OrderRequest request) {
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .data(orderService.createOrderFromCart(request))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @PutMapping("/{orderId}/status")
    ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId, @RequestBody OrderStatusUpdateRequest request) {
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .data(orderService.updateOrderStatus(orderId, request.getStatus()))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping("/all")
    ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        ApiResponse<List<OrderResponse>> apiResponse = ApiResponse.<List<OrderResponse>>builder()
                .data(orderService.getAll())
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders() {
        ApiResponse<List<OrderResponse>> apiResponse = ApiResponse.<List<OrderResponse>>builder()
                .data(orderService.getUserOrders())
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @DeleteMapping("/{orderId}")
    ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok()
                .body(ApiResponse.<OrderResponse>builder().build());
    }

    @GetMapping("/{orderId}/detail")
    ResponseEntity<ApiResponse<OrderDetailResponse>> getOrderDetail(@PathVariable Long orderId) {
        ApiResponse<OrderDetailResponse> apiResponse = ApiResponse.<OrderDetailResponse>builder()
                .data(orderItemService.getOrderDetailByOrderId(orderId))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping("/sizes")
    ResponseEntity<ApiResponse<Integer>> getOrderSizes() {
        return ResponseEntity.ok()
                .body(ApiResponse.<Integer>builder()
                        .data(orderService.getAllSize())
                        .build());
    }
}
