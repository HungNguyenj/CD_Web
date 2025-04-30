package org.nlu.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @Column(name = "username")
    String userName;

    @Column(name = "password")
    String password;

    @Column(name = "phoneNumber")
    String phoneNumber;

    @Column(name="address")
    String address;

    String email;

    boolean isDelete = false;

    @ManyToOne
    @JoinColumn(name = "role_id")
    Role role;
}
