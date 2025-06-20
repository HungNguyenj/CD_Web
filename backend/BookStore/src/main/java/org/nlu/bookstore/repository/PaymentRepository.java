package org.nlu.bookstore.repository;

import org.nlu.bookstore.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    public List<Payment> findAllByOrder_User_Username(String username);
}
