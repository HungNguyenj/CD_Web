package org.nlu.bookstore.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.ApiResponse;
import org.nlu.bookstore.dto.request.ProductRequest;
import org.nlu.bookstore.dto.response.ProductResponse;
import org.nlu.bookstore.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {

    ProductService productService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    ResponseEntity<ApiResponse<ProductResponse>> addProduct(@RequestBody ProductRequest request) {
        ApiResponse<ProductResponse> apiResponse = ApiResponse.<ProductResponse>builder()
                .data(productService.addProduct(request))
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping
    ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        ApiResponse<List<ProductResponse>> apiResponse = ApiResponse.<List<ProductResponse>>builder()
                .data(productService.getAllProducts())
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping("/{productId}")
    ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long productId) {
        ApiResponse<ProductResponse> apiResponse = ApiResponse.<ProductResponse>builder()
                .data(productService.getProduct(productId))
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}")
    ResponseEntity<ApiResponse<ProductResponse>> updateUser(
            @PathVariable Long userId, @RequestBody ProductRequest request) {
        ApiResponse<ProductResponse> apiResponse = ApiResponse.<ProductResponse>builder()
                .data(productService.updateProduct(userId, request))
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        productService.deleteProduct(userId);
        return ResponseEntity.ok().body(ApiResponse.<Void>builder().build());
    }

    //search
    @GetMapping("/search")
    ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(@RequestParam String keyword) {
        ApiResponse<List<ProductResponse>> apiResponse = ApiResponse.<List<ProductResponse>>builder()
                .data(productService.searchProduct(keyword))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    // goi y san pham
    @GetMapping("/suggestions")
    ResponseEntity<ApiResponse<List<ProductResponse>>> suggestProducts(@RequestParam Long productId) {
        ApiResponse<List<ProductResponse>> apiResponse = ApiResponse.<List<ProductResponse>>builder()
                .data(productService.getProductSuggest(productId))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }
}
