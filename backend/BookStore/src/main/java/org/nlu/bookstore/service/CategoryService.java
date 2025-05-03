package org.nlu.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.CategoryRequest;
import org.nlu.bookstore.dto.response.CategoryResponse;
import org.nlu.bookstore.entity.Category;
import org.nlu.bookstore.exception.AppException;
import org.nlu.bookstore.exception.ErrorCode;
import org.nlu.bookstore.mapper.CategoryMapper;
import org.nlu.bookstore.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {

    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }
        Category category = Category.builder()
                .name(request.getName())
                .build();
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(categoryMapper::toCategoryResponse).toList();
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

}
