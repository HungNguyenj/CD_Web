package org.nlu.bookstore.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.ApiResponse;
import org.nlu.bookstore.dto.request.CartItemRequest;
import org.nlu.bookstore.dto.request.CartItemUpdateRequest;
import org.nlu.bookstore.dto.response.CartItemListResponse;
import org.nlu.bookstore.dto.response.CartItemResponse;
import org.nlu.bookstore.service.CartItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartItemController {

    CartItemService cartItemService;

    @GetMapping()
    ResponseEntity<ApiResponse<CartItemListResponse>> getCartItems() {
        ApiResponse<CartItemListResponse> apiResponse = ApiResponse.<CartItemListResponse>builder()
                .data(cartItemService.getUserCart())
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping
    ResponseEntity<ApiResponse<CartItemListResponse>> addCartItem(@RequestBody CartItemRequest request) {
        ApiResponse<CartItemListResponse> apiResponse = ApiResponse.<CartItemListResponse>builder()
                .data(cartItemService.addCartItem(request))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @PutMapping
    ResponseEntity<ApiResponse<CartItemResponse>> updateCartItem(@RequestBody CartItemUpdateRequest request) {
        ApiResponse<CartItemResponse> apiResponse = ApiResponse.<CartItemResponse>builder()
                .data(cartItemService.updateCartItem(request))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @DeleteMapping("/{cartItemId}")
    ResponseEntity<ApiResponse<Void>> deleteCartItem(@PathVariable("cartItemId") Long cartItemId) {
        cartItemService.deleteCartItem(cartItemId);
        return ResponseEntity.ok()
                .body(ApiResponse.<Void>builder().build());
    }

}
