package org.nlu.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.entity.Order;
import org.nlu.bookstore.entity.OrderItem;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailResponse {
    Long orderId;
    List<OrderDetailItem> orderDetailItems;
    BigDecimal totalAmount;
}
