package org.nlu.bookstore.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.ApiResponse;
import org.nlu.bookstore.dto.request.CategoryRequest;
import org.nlu.bookstore.dto.response.CategoryResponse;
import org.nlu.bookstore.dto.response.ProductResponse;
import org.nlu.bookstore.service.CategoryService;
import org.nlu.bookstore.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    CategoryService categoryService;
    ProductService productService;

    @PreAuthorize("hasRole('ADMIN')")  // chi co admin moi co the su dung
    @PostMapping
    ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@RequestBody CategoryRequest request) {
        ApiResponse<CategoryResponse> apiResponse = ApiResponse.<CategoryResponse>builder()
                .data(categoryService.createCategory(request))
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping
    ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        ApiResponse<List<CategoryResponse>> apiResponse = ApiResponse.<List<CategoryResponse>>builder()
                .data(categoryService.getAllCategories())
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")  // chi co admin moi co the su dung
    @DeleteMapping("/{categoryId}")
    ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable("categoryId") Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok()
                .body(ApiResponse.<Void>builder().build());
    }

    @GetMapping("/{categoryId}")
    ResponseEntity<ApiResponse<List<ProductResponse>>> getProductByCategoryId
            (@PathVariable("categoryId") Long categoryId) {
        ApiResponse<List<ProductResponse>> apiResponse = ApiResponse.<List<ProductResponse>>builder()
                .data(productService.getProductsByCategory(categoryId))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping("/{categoryId}/byPrice")
    ResponseEntity<ApiResponse<List<ProductResponse>>> getProductByPrice(
            @PathVariable("categoryId") Long categoryId,
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        ApiResponse<List<ProductResponse>> apiResponse = ApiResponse.<List<ProductResponse>>builder()
                .data(productService.getProductByPrice(categoryId, minPrice, maxPrice))
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }

}
