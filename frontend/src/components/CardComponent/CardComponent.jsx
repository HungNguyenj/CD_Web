import React from 'react';
import { Card, Rate, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { WrapperCardStyle } from './style';
import { getImageUrl } from '../../utils/imageUtils';

const { Text, Title } = Typography;

const CardComponent = ({ product }) => {
    const { 
        id, 
        name, 
        price, 
        sold, 
        image, 
        rating, 
        discount, 
        author 
    } = product;

    const discountedPrice = price - (price * discount);

    return (
        <Link to={`/product/${id}`}>
            <WrapperCardStyle
                hoverable
                cover={
                    <img
                        alt={name}
                        src={getImageUrl(image)}
                        style={{ height: 200, objectFit: 'cover' }}
                    />
                }
            >
                <Title level={5} ellipsis={{ rows: 2 }}>{name}</Title>
                <Text type="secondary" ellipsis>Tác giả: {author}</Text>
                
                <div style={{ marginTop: 8 }}>
                    <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                        Đã bán: {sold}
                    </Text>
                </div>

                <div style={{ marginTop: 8 }}>
                    {discount > 0 && (
                        <>
                            <Text delete type="secondary" style={{ marginRight: 8 }}>
                                {price.toLocaleString('vi-VN')}đ
                            </Text>
                            <Tag color="red">-{(discount * 100).toFixed(0)}%</Tag>
                        </>
                    )}
                    <div>
                        <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>
                            {discountedPrice.toLocaleString('vi-VN')}đ
                        </Text>
                    </div>
                </div>
            </WrapperCardStyle>
        </Link>
    );
};

export default CardComponent;
