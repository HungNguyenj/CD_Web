package org.nlu.bookstore.service;


import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.response.OrderDetailItem;
import org.nlu.bookstore.dto.response.OrderDetailResponse;
import org.nlu.bookstore.entity.Order;
import org.nlu.bookstore.entity.OrderItem;
import org.nlu.bookstore.exception.AppException;
import org.nlu.bookstore.exception.ErrorCode;
import org.nlu.bookstore.repository.OrderItemRepository;
import org.nlu.bookstore.repository.OrderRepository;
import org.nlu.bookstore.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderItemService {

    OrderItemRepository orderItemRepository;
    ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public OrderDetailResponse getOrderDetailByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        List<OrderItem> orderItems = order.getOrderItems();

        // Tính toán các thông tin chi tiết
        BigDecimal totalAmount =
                BigDecimal.valueOf(orderItems.stream()
                        .mapToDouble(orderItem -> orderItem.getQuantity() * orderItem.getProduct().getPrice())
                        .sum());

        List<OrderDetailItem> orderDetailItems = orderItems.stream()
                .map(orderItem -> OrderDetailItem.builder()
                        .product(orderItem.getProduct())
                        .quantity(orderItem.getQuantity())
                        .subtotal(orderItem.getSubtotal())
                        .build()).toList();

        return OrderDetailResponse.builder()
                .orderId(order.getId())
                .orderDetailItems(orderDetailItems)
                .totalAmount(totalAmount)
                .build();
    }
}
