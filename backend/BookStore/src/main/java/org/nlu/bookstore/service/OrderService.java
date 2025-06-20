package org.nlu.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.OrderRequest;
import org.nlu.bookstore.dto.response.OrderResponse;
import org.nlu.bookstore.entity.CartItem;
import org.nlu.bookstore.entity.Order;
import org.nlu.bookstore.entity.OrderItem;
import org.nlu.bookstore.entity.User;
import org.nlu.bookstore.enums.OrderStatus;
import org.nlu.bookstore.exception.AppException;
import org.nlu.bookstore.exception.ErrorCode;
import org.nlu.bookstore.mapper.OrderMapper;
import org.nlu.bookstore.repository.CartItemRepository;
import org.nlu.bookstore.repository.OrderRepository;
import org.nlu.bookstore.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {

    OrderRepository orderRepository;
    CartItemService cartItemService;
    CartItemRepository cartItemRepository;
    UserRepository userRepository;
    OrderMapper orderMapper;

    public OrderResponse createOrderFromCart(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        //lay gio hang
        List<CartItem> cartItems = cartItemRepository.findAllByUserId(userId);
        if (cartItems.isEmpty())
            throw new AppException(ErrorCode.CART_EMPTY);

        // total amount
        BigDecimal totalAmount =
            BigDecimal.valueOf(cartItems.stream()
                    .mapToDouble(cartItem -> cartItem.getQuantity() * cartItem.getProduct().getPrice())
                    .sum());

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .totalAmount(totalAmount)
                .address(request.getAddress())
                .note(request.getNote())
                .phone(request.getPhone())
                .build();

        // Tạo các order item
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> OrderItem.builder()
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .order(order)
                        .subtotal(BigDecimal.valueOf(cartItem.getProduct().getPrice() * cartItem.getQuantity()))
                        .build())
                .toList();

        order.setOrderItems(orderItems);

        // xoa gio hang
        cartItemService.clearUserCart(userId);

        return orderMapper.toOrderResponse(orderRepository.save(order));
    }

    public OrderResponse updateOrderStatus(Long orderId, OrderStatus orderStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        order.setStatus(orderStatus);
        return orderMapper.toOrderResponse(orderRepository.save(order));
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Order> orders = orderRepository.findAllByUserId(user.getId());
        return orders.stream().map(orderMapper::toOrderResponse).toList();
    }

    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new AppException(ErrorCode.ORDER_CANNOT_CANCEL);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}
