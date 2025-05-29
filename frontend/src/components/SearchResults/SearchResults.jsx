import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import CardComponent from '../../components/CardComponent/CardComponent';
import { WrapperButtonMore } from '../../pages/HomePage/style.js';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(12);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keyword = params.get('keyword');

        if (keyword) {
            axios.get(`/api/products/search?keyword=${keyword}`)
                .then(response => {
                    setProducts(response.data);
                })
                .catch(error => console.error('Có lỗi xảy ra:', error));
        }
    }, [location.search]);

    const loadMoreProducts = () => {
        setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 12);
    };

    return (
        <div style={{ padding: '0 120px' }}>
            <h1>Kết quả tìm kiếm</h1>
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                {products.slice(0, visibleProducts).map((product) => (
                    <CardComponent key={product.id} product={product} />
                ))}
            </div>
            {visibleProducts < products.length && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <WrapperButtonMore
                        textButton="Xem thêm"
                        type="outline"
                        styleButton={{
                            border: '1px solid rgb(11,116,229)', color: 'rgb(11,116,229)',
                            width: '240px', height: '38px', borderRadius: '4px'
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
