import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Empty, Spin, message } from 'antd';
import axiosInstance from '../../api/axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import CardComponent from '../../components/CardComponent/CardComponent';
import { WrapperButtonMore } from '../../pages/HomePage/style.js';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(12);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keyword = params.get('keyword');

        if (keyword) {
            setLoading(true);
            axiosInstance.get(API_ENDPOINTS.PRODUCT_SEARCH, {
                params: { keyword }
            })
                .then(response => {
                    setProducts(response || []);
                })
                .catch(error => {
                    console.error('Có lỗi xảy ra:', error);
                    message.error('Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [location.search]);

    const loadMoreProducts = () => {
        setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 12);
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px' 
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!loading && products.length === 0) {
        return (
            <div style={{ 
                padding: '0 120px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '400px',
                marginTop: '50px'
            }}>
                <Empty
                    description={
                        <span>
                            Không tìm thấy sản phẩm phù hợp với từ khóa "{new URLSearchParams(location.search).get('keyword')}"
                        </span>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '0 120px' }}>
            <h1>Kết quả tìm kiếm cho "{new URLSearchParams(location.search).get('keyword')}"</h1>
            <div style={{ 
                marginTop: '20px', 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '30px', 
                flexWrap: 'wrap' 
            }}>
                {products.slice(0, visibleProducts).map((product) => (
                    <CardComponent key={product.id} product={product} />
                ))}
            </div>
            {visibleProducts < products.length && (
                <div style={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    marginTop: '30px',
                    marginBottom: '30px'
                }}>
                    <WrapperButtonMore
                        textButton="Xem thêm"
                        type="outline"
                        styleButton={{
                            border: '1px solid rgb(11,116,229)', 
                            color: 'rgb(11,116,229)',
                            width: '240px', 
                            height: '38px', 
                            borderRadius: '4px'
                        }}
                        styleTextButton={{ fontWeight: 500 }}
                        onClick={loadMoreProducts}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchResults;
