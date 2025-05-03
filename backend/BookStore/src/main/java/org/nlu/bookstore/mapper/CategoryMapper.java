package org.nlu.bookstore.mapper;

import org.mapstruct.Mapper;
import org.nlu.bookstore.dto.response.CategoryResponse;
import org.nlu.bookstore.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse(Category category);
}
