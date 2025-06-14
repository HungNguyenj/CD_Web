package org.nlu.bookstore.mapper;

import org.mapstruct.Mapper;
import org.nlu.bookstore.dto.response.OrderResponse;
import org.nlu.bookstore.entity.Order;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    public OrderResponse toOrderResponse(Order order);
}
