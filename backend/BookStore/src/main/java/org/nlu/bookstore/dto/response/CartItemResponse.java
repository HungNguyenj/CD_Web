package org.nlu.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.entity.CartItem;
import org.nlu.bookstore.entity.Product;
import org.nlu.bookstore.entity.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    Long id;
    User user;
    Product product;
    int quantity;
}
