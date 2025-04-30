package org.nlu.bookstore.configuration;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.nlu.bookstore.entity.User;
import org.nlu.bookstore.enums.RoleName;
import org.nlu.bookstore.repository.RoleRepository;
import org.nlu.bookstore.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
          if (userRepository.findByUserName("admin").isEmpty()) {
              var roles = roleRepository.findByName(RoleName.ADMIN.name())
                      .orElseThrow(() -> new RuntimeException("Role not exists"));

              User user = User.builder()
                      .userName("admin")
                      .password(passwordEncoder.encode("admin"))
                      .role(roles)
                      .build();

              userRepository.save(user);
              log.warn("admin user has been created with default password: admin, please change it");
          }
        };
    }

}
