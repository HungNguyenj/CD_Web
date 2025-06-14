package org.nlu.bookstore.enums;

public enum OrderStatus {
    PENDING,    // vua duoc tao
    PROCESSING, // dang duoc xu ly
    SHIPPED,    // da duoc gui di
    DELIVERED,  // da duoc giao
    CANCELLED,  // da bi huy
    REFUNDED,   // hoan tien
}
