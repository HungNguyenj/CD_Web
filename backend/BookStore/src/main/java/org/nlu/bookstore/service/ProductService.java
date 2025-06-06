package org.nlu.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.ProductRequest;
import org.nlu.bookstore.dto.response.ProductResponse;
import org.nlu.bookstore.entity.Category;
import org.nlu.bookstore.entity.Product;
import org.nlu.bookstore.exception.AppException;
import org.nlu.bookstore.exception.ErrorCode;
import org.nlu.bookstore.mapper.ProductMapper;
import org.nlu.bookstore.repository.CategoryRepository;
import org.nlu.bookstore.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {

    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    ProductMapper productMapper;

    public ProductResponse addProduct(ProductRequest request) {
        if (!categoryRepository.existsByName(request.getCategory())) {
            throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
        }
        Category category = categoryRepository.findByName(request.getCategory());

        Product product = productMapper.toProduct(request);
        product.setCategory(category);

        return productMapper.toProductResponse(productRepository.save(product));
    }

    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();

        return products.stream().map(productMapper::toProductResponse).toList();
    }

    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        return productMapper.toProductResponse(product);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!categoryRepository.existsByName(request.getCategory())) {
            throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
        }
        Category category = categoryRepository.findByName(request.getCategory());

        productMapper.updateProduct(product, request);
        product.setCategory(category);

        return productMapper.toProductResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

}
