package org.nlu.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.UserCreationRequest;
import org.nlu.bookstore.dto.response.UserResponse;
import org.nlu.bookstore.entity.User;
import org.nlu.bookstore.enums.RoleName;
import org.nlu.bookstore.mapper.UserMapper;
import org.nlu.bookstore.repository.RoleRepository;
import org.nlu.bookstore.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

    RoleService roleService;
    UserRepository userRepository;
    UserMapper userMapper;

    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByUserName(request.getUserName())){
            throw new RuntimeException("User Not Found");
        }

        User user = userMapper.toUser(request);
        user.setRole(roleService.findByName(RoleName.USER.name()));

        return userMapper.toUserResponse(userRepository.save(user));
    }
}
