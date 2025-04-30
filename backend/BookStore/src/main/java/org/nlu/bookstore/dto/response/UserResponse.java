package org.nlu.bookstore.dto.response;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.entity.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    long id;
    String userName;
    String phoneNumber;
    String address;
    String email;
    String role;
}
