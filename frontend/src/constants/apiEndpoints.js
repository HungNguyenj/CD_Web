export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
    
    // Users
    USERS: '/users',
    USER_PROFILE: '/users/my-profile',
    USER_BY_ID: (id) => `/users/${id}`,
    
    // Products
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id) => `/products/${id}`,
    PRODUCT_SEARCH: '/products/search',
    PRODUCT_SUGGESTIONS: '/products/suggestions',
    
    // Categories
    CATEGORIES: '/categories',
    CATEGORY_BY_ID: (id) => `/categories/${id}`,
    PRODUCTS_BY_CATEGORY: (id) => `/categories/${id}`,
    PRODUCTS_BY_PRICE: (id) => `/categories/${id}/byPrice`,
    
    // Cart
    CART: '/carts',
    CART_ITEM: (id) => `/carts/${id}`,
    
    // Orders
    ORDERS: '/orders',
    ORDER_BY_ID: (id) => `/orders/${id}`,
    ORDER_STATUS: (id) => `/orders/${id}/status`,
    ORDER_DETAIL: (id) => `/orders/${id}/detail`,
    
    // Payments
    PAYMENTS: '/payments',
    PAYMENT_CREATE: '/payments/create',
    USER_PAYMENTS: '/payments/user',
    ALL_PAYMENTS: '/payments/all',
    
    // Home
    HOME: '/home'
}; 