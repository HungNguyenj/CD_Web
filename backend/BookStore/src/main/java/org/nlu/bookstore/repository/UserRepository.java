package org.nlu.bookstore.repository;

import org.nlu.bookstore.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    boolean existsByUserName(String userName);
}
