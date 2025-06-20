package org.nlu.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    Long paymentId;
    BigDecimal amount;
    PaymentMethod method;
    Long orderId;
    List<OrderDetailItem> orderDetailItems;
}
