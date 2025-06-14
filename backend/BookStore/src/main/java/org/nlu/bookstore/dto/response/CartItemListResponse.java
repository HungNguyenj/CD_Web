package org.nlu.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.entity.CartItem;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemListResponse {
    List<CartItem> cartItemList;
}
