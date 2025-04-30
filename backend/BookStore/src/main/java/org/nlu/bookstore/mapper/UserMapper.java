package org.nlu.bookstore.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.nlu.bookstore.dto.request.UserCreationRequest;
import org.nlu.bookstore.dto.response.UserResponse;
import org.nlu.bookstore.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    @Mapping(source = "role.name", target = "role")
    UserResponse toUserResponse(User user);
}
