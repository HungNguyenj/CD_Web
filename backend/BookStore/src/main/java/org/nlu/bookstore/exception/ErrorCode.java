package org.nlu.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User already existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    ROLE_NOT_EXISTED(1008, "Role not existed", HttpStatus.NOT_FOUND),
    EMAIL_INVALID(1009, "Your email is not valid", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED(1010, "This category existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1011, "This category not existed in database", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(1012, "This product not found", HttpStatus.BAD_REQUEST),
    CART_ITEM_NOT_FOUND(1013, "Cart item not found", HttpStatus.BAD_REQUEST),
    QUANTITY_EXCEEDS_STOCK(1014, "Product quantity is not enough for request", HttpStatus.BAD_REQUEST),
    CART_EMPTY(1015, "Cart is empty", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(1016, "Order not found", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_CANCEL(1017, "Order not cancel", HttpStatus.BAD_REQUEST),

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
