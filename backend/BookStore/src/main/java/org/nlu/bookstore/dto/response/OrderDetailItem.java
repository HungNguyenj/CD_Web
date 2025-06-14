package org.nlu.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.entity.Product;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailItem {
    Product product;
    int quantity;
    BigDecimal subtotal;
}
