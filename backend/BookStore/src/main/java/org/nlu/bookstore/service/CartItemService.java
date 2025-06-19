package org.nlu.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.nlu.bookstore.dto.request.CartItemRequest;
import org.nlu.bookstore.dto.request.CartItemUpdateRequest;
import org.nlu.bookstore.dto.response.CartItemListResponse;
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

    public CartItemListResponse getUserCart() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<CartItem> cartItems = cartItemRepository.findAllByUserId(user.getId());
        return CartItemListResponse.builder()
                .cartItemList(cartItems)
                .build();
    }

    public CartItemListResponse addCartItem(CartItemRequest request) {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (request.getQuantity() > product.getQuantity()) {
            throw new AppException(ErrorCode.QUANTITY_EXCEEDS_STOCK);
        }

        // tim kiem item da ton tai trong db chua
        CartItem existingItem = cartItemRepository.findByUserIdAndProductId(
                user.getId(), product.getId());

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (newQuantity > product.getQuantity()) {
                throw new AppException(ErrorCode.QUANTITY_EXCEEDS_STOCK);
            }

            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
            return CartItemListResponse.builder()
                    .cartItemList(cartItemRepository.findAllByUserId(user.getId()))
                    .build();
        }

        // neu chua ton tai trong db
        CartItem newItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(request.getQuantity())
                .build();
        cartItemRepository.save(newItem);

        return CartItemListResponse.builder()
                .cartItemList(cartItemRepository.findAllByUserId(user.getId()))
                .build();
    }

    public CartItemResponse updateCartItem(CartItemUpdateRequest request) {
        CartItem item = cartItemRepository.findById(request.getCartItemId())
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));
        if (request.getQuantity() > item.getProduct().getQuantity()) {
            throw new AppException(ErrorCode.QUANTITY_EXCEEDS_STOCK);
        }
        item.setQuantity(item.getQuantity() + request.getQuantity());

        return cartItemMapper.toCartItemResponse(cartItemRepository.save(item));
    }

    public void deleteCartItem(Long cartItemId) {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        cartItemRepository.deleteById(cartItemId);
    }

    public void clearUserCart(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<CartItem> cartItems = cartItemRepository.findAllByUserId(user.getId());
        for (CartItem cartItem : cartItems) {
            cartItemRepository.deleteById(cartItem.getId());
        }
    }
}
