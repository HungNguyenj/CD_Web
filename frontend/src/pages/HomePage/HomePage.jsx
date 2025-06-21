import React, { useEffect, useState } from "react";
import Footer from "../../components/FooterComponent/Footer";
import {
    WrapperPage,
    WrapperButtonMore,
    WrapperProducts,
    WrapperFeatured,
    FeaturedTitle,
    WrapperTypeProduct
} from "./style";
import slide1 from '../../assets/images/slide1.jpg';
import slide2 from '../../assets/images/slide2.jpg';
import slide3 from '../../assets/images/slide3.jpg';
import SlideComponent from "../../components/SlideComponent/SlideComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { Row, Col, Spin, Typography } from 'antd';
import axiosInstance from '../../api/axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const { Title } = Typography;

const calculateDiscountedPrice = (product) => {
    if (!product.discount || product.discount === 0) {
        return product.price;
    }
    const discountedPrice = product.price * (1 - product.discount / 100);
    return Math.round(discountedPrice);
};

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleProducts, setVisibleProducts] = useState(12);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        // Flash Sale thời gian 2 giờ
        const endTime = Date.now() + 2 * 60 * 60 * 1000;
        const timer = setInterval(() => {
            const diff = endTime - Date.now();
            setTimeLeft(diff > 0 ? diff : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES);
            setCategories(response);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS);
            setProducts(response);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Group products by category
    const productsByCategory = categories.reduce((acc, category) => {
        acc[category.name] = products.filter(product => product.category === category.name);
        return acc;
    }, {});

    const loadMoreProducts = () => {
        setVisibleProducts(prev => prev + 12);
    };

    const formatTime = ms => {
        const totalSec = Math.floor(ms / 1000);
        const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
        const s = String(totalSec % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const flashSaleBooks = products.filter(p => p.discount > 0);
    const featuredBooks = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 6);
    const bestSellerBooks = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(6, 12);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
    };

    return (
        <>
            <WrapperPage>
                <SlideComponent />
                
                <div style={{ marginTop: '20px' }}>
                    <WrapperTypeProduct>
                        {categories.map((category) => (
                            <TypeProduct name={category.name} key={category.id} />
                        ))}
                    </WrapperTypeProduct>
                </div>

                <Spin spinning={loading}>
                    {categories.map((category) => {
                        const categoryProducts = productsByCategory[category.name];
                        if (!categoryProducts || categoryProducts.length === 0) return null;

                        return (
                            <div key={category.id} style={{ marginTop: '40px' }}>
                                <Title level={3} style={{ marginBottom: '20px' }}>
                                    {category.name}
                                </Title>
                                <Row gutter={[16, 16]}>
                                    {categoryProducts.slice(0, 8).map((product) => (
                                        <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                            <CardComponent product={product} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        );
                    })}
                </Spin>

                {/* FLASH SALE */}
                <div style={{ background: '#ff4d4f', padding: '16px', borderRadius: '8px', marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
                        <h3 style={{ margin: 0 }}>FLASH SALE</h3>
                        <span>Thời gian còn lại: {formatTime(timeLeft)}</span>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <Slider {...sliderSettings}>
                            {flashSaleBooks.map(book => (
                                <div key={book.id}>
                                    <CardComponent product={book} showDiscount />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                {/* TỦ SÁCH NỔI BẬT */}
                <FeaturedTitle style={{ textAlign: 'center', margin: '40px 0 20px' }}>Tủ sách nổi bật</FeaturedTitle>
                <div style={{ marginBottom: 40 }}>
                    <Slider {...sliderSettings}>
                        {featuredBooks.map(book => (
                            <div key={book.id}>
                                <CardComponent product={book} />
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* SẢN PHẨM BÁN CHẠY */}
                <FeaturedTitle style={{ textAlign: 'center', margin: '40px 0 20px' }}>Sản phẩm bán chạy</FeaturedTitle>
                <div style={{ marginBottom: 40 }}>
                    <Slider {...sliderSettings}>
                        {bestSellerBooks.map(book => (
                            <div key={book.id}>
                                <CardComponent product={book} />
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* SLIDE QUẢNG CÁO */}
                <SlideComponent arrImages={[slide1, slide2, slide3]} />

                {/* TẤT CẢ SẢN PHẨM */}
                <div style={{ textAlign: 'center', margin: '40px 0 20px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#333' }}>Tất cả sản phẩm</h2>
                </div>
                <WrapperProducts>
                    {products.slice(0, visibleProducts).map(product => (
                        <CardComponent key={product.id} product={product} />
                    ))}
                </WrapperProducts>
                {visibleProducts < products.length && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                        <WrapperButtonMore textButton="Xem thêm" type="outline" onClick={loadMoreProducts} />
                    </div>
                )}
            </WrapperPage>
            <Footer />
        </>
    );
};

export default HomePage;
