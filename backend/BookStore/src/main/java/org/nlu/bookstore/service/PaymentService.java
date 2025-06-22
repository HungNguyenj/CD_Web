package org.nlu.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.PaymentRequest;
import org.nlu.bookstore.dto.response.OrderDetailItem;
import org.nlu.bookstore.dto.response.PaymentResponse;
import org.nlu.bookstore.entity.Order;
import org.nlu.bookstore.entity.Payment;
import org.nlu.bookstore.exception.AppException;
import org.nlu.bookstore.exception.ErrorCode;
import org.nlu.bookstore.repository.OrderRepository;
import org.nlu.bookstore.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentService {

    PaymentRepository paymentRepository;
    OrderRepository orderRepository;

    public PaymentResponse processPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        List<OrderDetailItem> orderDetailItems = order.getOrderItems()
                .stream()
                .map(orderItem -> {
                    return OrderDetailItem.builder()
                           .product(orderItem.getProduct())
                           .quantity(orderItem.getQuantity())
                           .subtotal(orderItem.getSubtotal())
                           .build();
                })
                .toList();

        Payment payment = Payment.builder()
                .order(order)
                .method(request.getMethod())
                .amount(order.getTotalAmount())
                .build();
        Payment result = paymentRepository.save(payment);

        return PaymentResponse.builder()
                .paymentId(result.getId())
                .amount(result.getAmount())
                .method(result.getMethod())
                .orderId(order.getId())
                .orderDetailItems(orderDetailItems)
                .build();
    }

    public List<PaymentResponse> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return payments.stream()
                .map(payment -> {
                    List<OrderDetailItem> orderDetailItems = payment.getOrder().getOrderItems()
                            .stream()
                            .map(orderItem -> {
                                return OrderDetailItem.builder()
                                        .product(orderItem.getProduct())
                                        .quantity(orderItem.getQuantity())
                                        .subtotal(orderItem.getSubtotal())
                                        .build();
                            })
                            .toList();

                    return PaymentResponse.builder()
                            .paymentId(payment.getId())
                            .amount(payment.getAmount())
                            .method(payment.getMethod())
                            .orderId(payment.getOrder().getId())
                            .orderDetailItems(orderDetailItems)
                            .build();
                }).toList();
    }

    public List<PaymentResponse> getPaymentsByUserName(String username) {
        List<Payment> payments = paymentRepository.findAllByOrder_User_Username(username);
        return payments.stream()
                .map(payment -> {
                    List<OrderDetailItem> orderDetailItems = payment.getOrder().getOrderItems()
                            .stream()
                            .map(orderItem -> {
                                return OrderDetailItem.builder()
                                        .product(orderItem.getProduct())
                                        .quantity(orderItem.getQuantity())
                                        .subtotal(orderItem.getSubtotal())
                                        .build();
                            })
                            .toList();

                    return PaymentResponse.builder()
                            .paymentId(payment.getId())
                            .amount(payment.getAmount())
                            .method(payment.getMethod())
                            .orderId(payment.getOrder().getId())
                            .orderDetailItems(orderDetailItems)
                            .build();
                }).toList();
    }

}
