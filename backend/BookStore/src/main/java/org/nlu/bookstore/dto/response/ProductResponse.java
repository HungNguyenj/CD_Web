package org.nlu.bookstore.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Long id;
    String name;
    Double price;
    int sold;
    String image;
    double rating;
    double discount;
    String category;
    int quantity;

    String description;
    String author;
    String publisher;
    Integer publishYear;
}
