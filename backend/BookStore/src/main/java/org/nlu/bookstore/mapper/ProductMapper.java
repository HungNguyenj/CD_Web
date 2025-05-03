package org.nlu.bookstore.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.nlu.bookstore.dto.request.ProductRequest;
import org.nlu.bookstore.dto.response.ProductResponse;
import org.nlu.bookstore.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "category", ignore = true)
    Product toProduct(ProductRequest request);

    @Mapping(source = "category.name", target = "category") // chuyen name cua category sang cho response
    ProductResponse toProductResponse(Product product);

    @Mapping(target = "category", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductRequest request);
}
