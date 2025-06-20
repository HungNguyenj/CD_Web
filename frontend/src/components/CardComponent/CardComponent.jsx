import Meta from "antd/es/card/Meta";
import React from "react";
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText } from "./style";
import { StarFilled, ShoppingCartOutlined } from '@ant-design/icons';
import logo from '../../assets/images/logo.png'
import { WrapperStyleTextSell } from '../ProductDetailComponent/style'
import { Link } from "react-router-dom";
import { message } from "antd";

const CardComponent = ({ product }) => {
    const { id, name, sold, price, image, rating, discount } = product;

    const handleCartClick = (e) => {
        e.preventDefault();
        addToCart(id);
    };

    const addToCart = (productId, quantity = 1) => {
        fetch(`/api/cart?productId=${productId}&quantity=${quantity}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId, quantity }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then((data) => {
                message.success("Đã thêm sản phẩm vào giỏ hàng!", 1);
            })
            .catch((error) => {
                console.error("Có lỗi xảy ra:", error);
            });
    };

    const imagePath = `/assets/images/${image}`;
    const discountedPrice = Math.round(price * (1 - discount / 100));

    return (
        <Link style={{ textDecoration: 'none' }} to={`/product/${id}`}>
            <WrapperCardStyle hoverable style={{ width: 240 }} bodyStyle={{ padding: '10px' }} cover={<img alt="product" src={imagePath} />}>
                <img src={logo} style={{ width: '68px', height: '14px', position: 'absolute', top: -1, left: 0, borderTopLeftRadius: '3px' }} />
                <StyleNameProduct>{name}</StyleNameProduct>
                <WrapperReportText>
                    <span style={{ marginRight: '4px' }}>
                        <span>{rating}</span>
                        <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                    </span>
                    <WrapperStyleTextSell>| Đã bán {sold}+</WrapperStyleTextSell>
                </WrapperReportText>
                <WrapperPriceText>
                    <span style={{ marginRight: '8px' }}>{discountedPrice} đ</span>
                    {discount > 0 && (
                        <WrapperDiscountText>-{discount}%</WrapperDiscountText>
                    )}
                </WrapperPriceText>
                <ShoppingCartOutlined
                    onClick={handleCartClick}
                    style={{ position: 'absolute', bottom: '5px', right: '10px', fontSize: '24px', color: '#1890ff', cursor: 'pointer' }}
                />
            </WrapperCardStyle>
        </Link>
    )
}

export default CardComponent;
