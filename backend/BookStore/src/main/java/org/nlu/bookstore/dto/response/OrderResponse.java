package org.nlu.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.enums.PaymentMethod;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    private Long id;
    private String status;
    private BigDecimal totalAmount;
    private String createdAt;
    private String updatedAt;
    PaymentMethod paymentMethod;
    private String address;
    private String phone;

}
