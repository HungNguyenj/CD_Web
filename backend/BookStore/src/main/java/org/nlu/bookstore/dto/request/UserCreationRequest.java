package org.nlu.bookstore.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    String userName;
    @Size(min = 8, message = "PASSWORD_INVALID")
    String password;
    String phoneNumber;
    String address;
    @Email(message = "EMAIL_INVALID")
    String email;
}
