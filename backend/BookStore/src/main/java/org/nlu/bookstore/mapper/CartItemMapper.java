package org.nlu.bookstore.mapper;

import org.mapstruct.Mapper;
import org.nlu.bookstore.dto.request.CartItemRequest;
import org.nlu.bookstore.dto.response.CartItemResponse;
import org.nlu.bookstore.entity.CartItem;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    CartItem toCartItem(CartItemRequest request);
    CartItemResponse toCartItemResponse(CartItem cartItem);
}
