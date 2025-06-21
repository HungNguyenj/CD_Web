import { Button, Col, Image, Row, InputNumber, message } from "antd";
import React, { useEffect, useState } from "react";
import { StarFilled, StarTwoTone } from '@ant-design/icons';
import { WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber, WrapperDescription, TitleDescription, TextDescription } from "./style";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import CardComponent from "../CardComponent/CardComponent";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { getImageUrl } from "../../utils/imageUtils";

const ProductDetailComponent = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const [showMore, setShowMore] = useState(false);
    const [suggestedProducts, setSuggestedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await axiosInstance.get(API_ENDPOINTS.PRODUCT_BY_ID(productId));
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
                message.error("Không thể tải thông tin sản phẩm");
            }
        };
        fetchProduct();
    }, [productId]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const data = await axiosInstance.get(API_ENDPOINTS.PRODUCT_SUGGESTIONS, {
                    params: { productId: parseInt(productId) }
                });
                setSuggestedProducts(data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };
        fetchSuggestions();
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const handleQuantityChange = (value) => {
        setQuantity(value);
    };

    const isLoggedIn = () => {
        return !!localStorage.getItem('token');
    };

    const addToCart = async (productId, quantity, redirectToOrder = false) => {
        try {
            await axiosInstance.post(API_ENDPOINTS.CART, {
                productId,
                quantity
            });
            message.success("Đã thêm sản phẩm vào giỏ hàng!");
                if (redirectToOrder) {
                    navigate('/order');
                } else {
                    navigate('/cart');
                }
        } catch (error) {
            console.error("Error adding to cart:", error);
            message.error("Không thể thêm sản phẩm vào giỏ hàng");
        }
    };

    const handleBuyNow = () => {
        if (!isLoggedIn()) {
            navigate('/login');
        } else {
            navigate('/checkout', { state: { productId: product.id, quantity: selectedQuantity } });
        }
    };

    const handleAddToCart = () => {
        if (!isLoggedIn()) {
            navigate('/login');
        } else {
            addToCart(productId, quantity, true);
        }
    };

    const imagePath = getImageUrl(product.image);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const shortDescription = product.description?.split(" ").slice(0, 30).join(" ") + (product.description?.split(" ").length > 30 ? "..." : "");

    return (
        <div style={{ padding: '40px 80px', background: '#f7f7f7' }}>
            <Row style={{ padding: '24px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
                <Col span={10} style={{ borderRight: '1px solid #f0f0f0', paddingRight: '24px' }}>
                    <Image src={imagePath} alt={product.name} preview={false} style={{ borderRadius: '8px' }} />
                    <Row style={{ padding: '10px', justifyContent: 'space-between', marginTop: '20px' }}>
                        {[...Array(4)].map((_, i) => (
                            <WrapperStyleColImage key={i} span={6}>
                                <WrapperStyleImageSmall src={imagePath} alt={product.name} preview={false} />
                            </WrapperStyleColImage>
                        ))}
                    </Row>
                </Col>
                <Col span={14} style={{ paddingLeft: '24px' }}>
                    <WrapperStyleNameProduct style={{ fontSize: '28px' }}>{product.name}</WrapperStyleNameProduct>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
                        <span style={{ fontSize: '18px', marginRight: '8px', fontWeight: 'bold', color: '#ff4d4f' }}>{product.rating}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(5)].map((_, index) => {
                                const fullStar = Math.floor(product.rating);
                                const isHalf = product.rating - fullStar >= 0.5 && index === fullStar;
                                return (
                                    <span key={index} style={{ marginRight: '2px' }}>
                                        {index < fullStar ? (
                                            <StarFilled style={{ fontSize: '24px', color: '#FFD700' }} />
                                        ) : isHalf ? (
                                            <StarTwoTone twoToneColor={['#FFD700', '#ccc']} style={{ fontSize: '24px' }} />
                                        ) : (
                                            <StarFilled style={{ fontSize: '24px', color: '#ccc' }} />
                                        )}
                                    </span>
                                );
                            })}
                        </div>
                        <WrapperStyleTextSell style={{ marginLeft: '16px', fontSize: '16px' }}>| Đã bán {product.sold}+</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct style={{ fontSize: '36px', color: '#ff4d4f' }}>
                            {Math.round(product.price * (1 - product.discount / 100))} đ
                        </WrapperPriceTextProduct>
                        {product.discount > 0 && (
                            <span style={{ marginLeft: '16px', textDecoration: 'line-through', color: '#888', fontSize: '20px' }}>
            {product.price} đ
        </span>
                        )}
                        {product.discount > 0 && (
                            <span style={{ marginLeft: '12px', color: '#ff4d4f', fontWeight: 'bold', fontSize: '20px' }}>
            -{product.discount}%
        </span>
                        )}
                    </WrapperPriceProduct>

                    <WrapperAddressProduct style={{ margin: '16px 0' }}>
                        <span style={{ fontWeight: '500' }}>Giao đến: </span>
                        <span className="address">Q.Thủ Đức - TP.HCM</span>
                        <span className="change-address"> Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <div style={{ margin: '20px 0', padding: '20px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ marginBottom: '12px', fontWeight: '500' }}>Số lượng</div>
                        <WrapperQualityProduct>
                            <InputNumber
                                min={1}
                                defaultValue={1}
                                value={quantity}
                                onChange={handleQuantityChange}
                            />
                        </WrapperQualityProduct>

                        {/* Thông tin chi tiết */}
                        <div style={{ marginTop: '24px' }}>
                            <div style={{ marginBottom: '12px', fontWeight: '700', fontSize: '22px' }}>Thông tin chi tiết</div>
                            <div style={{ fontSize: '16px', lineHeight: '1.8' }}>
                                <div><strong>Tác giả:</strong> {product.author || 'Đang cập nhật'}</div>
                                <div><strong>Nhà xuất bản:</strong> {product.publisher || 'Đang cập nhật'}</div>
                                <div><strong>Năm xuất bản:</strong> {product.publishYear || 'Đang cập nhật'}</div>
                                <div><strong>Số trang:</strong> {product.pageCount ? `${product.pageCount} trang` : 'Đang cập nhật'}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'linear-gradient(90deg, #ff4d4f 0%, #ff7a45 100%)',
                                height: '56px',
                                width: '240px',
                                border: 'none',
                                borderRadius: '8px',
                            }}
                            textButton={'Mua ngay'}
                            styleTextButton={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}
                            onClick={handleBuyNow}
                        ></ButtonComponent>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#fff',
                                height: '56px',
                                width: '240px',
                                border: '1px solid #ff4d4f',
                                borderRadius: '8px',
                                color: '#ff4d4f'
                            }}
                            textButton={'Thêm vào giỏ hàng'}
                            styleTextButton={{ color: '#ff4d4f', fontSize: '18px', fontWeight: '700' }}
                            onClick={handleAddToCart}
                        ></ButtonComponent>
                    </div>
                </Col>
            </Row>

            <WrapperDescription>
                <TitleDescription style={{ fontSize: '20px' }}>Mô tả sản phẩm</TitleDescription>
                <TextDescription style={{ fontSize: '16px' }}>
                    {showMore ? product.description : shortDescription || 'Sản phẩm chưa có mô tả chi tiết.'}
                </TextDescription>
                {product.description?.split(" ").length > 30 && (
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <button
                            onClick={toggleShowMore}
                            style={{
                                padding: '14px 32px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#fff',
                                backgroundColor: '#007bff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {showMore ? 'Thu gọn' : 'Xem thêm'}
                        </button>
                    </div>
                )}
            </WrapperDescription>

            <div style={{ marginTop: '60px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>Gợi ý cho bạn</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {suggestedProducts && suggestedProducts.length > 0 ? (
                        suggestedProducts.map((item) => (
                            <CardComponent key={item.id} product={item} />
                        ))
                    ) : (
                        <p>Không có sản phẩm gợi ý</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailComponent;
