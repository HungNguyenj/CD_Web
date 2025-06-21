// routes.js
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import RegisterPage from "../pages/RegisterPage/Register.js";
import LoginPage from '../pages/LoginPage/Login.js';
import AdminPage from "../pages/AdminPage/AdminPage.jsx";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import ProfilePage from "../pages/UserProfilePage/ProfilePage";
import SearchResults from "../components/SearchResults/SearchResults";
import OrderInforPage from "../pages/OrderInforPage/OrderInforPage";
import OrderSuccessPage from "../pages/OrderSuccessPage/OrderSuccessPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true 
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true 
    },
    {
        path: '/order-success',
        page: OrderSuccessPage,
        isShowHeader: true
    },
    {
        path: '/orderInfo',
        page: OrderInforPage,
        isShowHeader: true
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true 
    },
    {
        path: '/category/:categoryId',
        page: TypeProductPage,
        isShowHeader: true 
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: true 
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true
    },
    {
        path: '/checkout',
        page: CheckoutPage,
        isShowHeader: true
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: true 
    },
    {
        path: '/product/:productId',
        page: ProductDetailPage,
        isShowHeader: true 
    },
    {
        path: 'search-results',
        page: SearchResults,
        isShowHeader: true
    },
    {
        path: '/login',
        page: LoginPage,
        isShowHeader: true
    },
    {
        path: '/register',
        page: RegisterPage,
        isShowHeader: true
    },
    {
        path: '/admin',
        page: AdminPage,
        isShowHeader: false,
        isAdmin: true
    },
    {
        path: '*',
        page: NotFoundPage
    },
];

  



