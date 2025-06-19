package org.nlu.bookstore.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.nlu.bookstore.service.CategoryService;
import org.nlu.bookstore.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HomeController {

    ProductService productService;
    CategoryService categoryService;

    @GetMapping
    public Map<String, Object> getHome() {
        log.info("Fetching home data");
        Map<String, Object> homeData = new HashMap<>();
        homeData.put("products", productService.getAllProducts());
        homeData.put("categories", categoryService.getAllCategories());
        return homeData;
    }

}
