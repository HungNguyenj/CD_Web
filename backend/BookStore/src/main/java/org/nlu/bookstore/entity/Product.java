package org.nlu.bookstore.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "products")
public class Product extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;
    Double price;
    int sold;
    String image;
    double rating;
    double discount;
    int quantity;

    String description;
    String author;
    String publisher;
    Integer publishYear;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference // con
    Category category;
}
