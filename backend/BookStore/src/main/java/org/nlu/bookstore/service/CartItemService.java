package org.nlu.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.CartItemRequest;
import org.nlu.bookstore.dto.response.CartItemResponse;
import org.nlu.bookstore.entity.CartItem;
import org.nlu.bookstore.entity.Product;
import org.nlu.bookstore.entity.User;
import org.nlu.bookstore.exception.AppException;
import org.nlu.bookstore.exception.ErrorCode;
import org.nlu.bookstore.mapper.CartItemMapper;
import org.nlu.bookstore.repository.CartItemRepository;
import org.nlu.bookstore.repository.ProductRepository;
import org.nlu.bookstore.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartItemService {

    CartItemRepository cartItemRepository;
    CartItemMapper cartItemMapper;
    UserRepository userRepository;
    ProductRepository productRepository;

    public CartItemResponse createCartItem(CartItemRequest request) {
        User user = userRepository.findByUsername(request.getUserName())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(request.getQuantity())
                .build();

        cartItemRepository.save(cartItem);

        return cartItemMapper.toCartItemResponse(cartItem);
    }

    public List<CartItemResponse> getAllCartItems() {
        List<CartItem> cartItems = cartItemRepository.findAll();
        return cartItems.stream().map(cartItemMapper::toCartItemResponse).toList();
    }

    public List<CartItemResponse> getMyCartItems() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        List<CartItem> cartItems = cartItemRepository.findAllByUserId(user.getId());

        return cartItems.stream().map(cartItemMapper::toCartItemResponse).toList();
    }

    public List<CartItemResponse> getCartItemsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        List<CartItem> cartItems = cartItemRepository.findAllByUserId(user.getId());
        return cartItems.stream().map(cartItemMapper::toCartItemResponse).toList();
    }

    public CartItemResponse updateCartItem(Long cartId ,CartItemRequest request) {
        CartItem cartItem = cartItemRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        cartItem.setQuantity(request.getQuantity());

        return cartItemMapper.toCartItemResponse(cartItem);
    }

    public void deleteCartItem(Long id) {
        cartItemRepository.deleteById(id);
    }

}
