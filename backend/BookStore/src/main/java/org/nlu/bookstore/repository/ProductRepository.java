package org.nlu.bookstore.repository;

import org.nlu.bookstore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase
            (String productNameKeyword, String descriptionKeyword);

    List<Product> findAllByCategory_Id(Long categoryId);

    List<Product> findByCategory_IdAndPriceBetween(Long categoryId, Double lowPrice, Double highPrice);
}
