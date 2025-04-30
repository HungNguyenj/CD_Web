package org.nlu.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    Long id;
    String userName;
    String password;
    String phoneNumber;
    String address;
    String email;
}
