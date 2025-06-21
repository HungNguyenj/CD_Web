package org.nlu.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.enums.PaymentMethod;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    String address;
    String note;
    String phone;
    PaymentMethod paymentMethod;
}
