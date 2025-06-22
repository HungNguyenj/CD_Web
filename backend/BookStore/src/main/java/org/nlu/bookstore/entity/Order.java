package org.nlu.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.enums.OrderStatus;
import org.nlu.bookstore.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    List<OrderItem> orderItems;

    @Enumerated(EnumType.STRING)
    OrderStatus status; // ENUM: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED

    @Enumerated(EnumType.STRING)
    PaymentMethod paymentMethod;

    BigDecimal totalAmount;

    String address;

    String note;

    String phone;

}
