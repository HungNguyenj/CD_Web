package org.nlu.bookstore.configuration;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.nlu.bookstore.entity.Role;
import org.nlu.bookstore.entity.User;
import org.nlu.bookstore.enums.RoleName;
import org.nlu.bookstore.repository.RoleRepository;
import org.nlu.bookstore.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner1(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName(RoleName.ADMIN.name()).isEmpty()) {
                Role role = Role.builder()
                        .name(RoleName.ADMIN.name())
                        .build();
                roleRepository.save(role);
            }
            if (roleRepository.findByName(RoleName.USER.name()).isEmpty()) {
                Role role = Role.builder()
                        .name(RoleName.USER.name())
                        .build();
                roleRepository.save(role);
            }
        };
    }

    @Bean
    ApplicationRunner applicationRunner2(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
          if (userRepository.findByUsername("admin").isEmpty()) {
              var roles = roleRepository.findAllByName(RoleName.ADMIN.name());

              User user = User.builder()
                      .username("admin")
                      .password(passwordEncoder.encode("admin"))
                      .roles(new HashSet<>(roles))
                      .build();

              userRepository.save(user);
              log.warn("admin user has been created with default password: admin, please change it");
          }
        };
    }

}
