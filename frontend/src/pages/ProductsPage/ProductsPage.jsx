import React, { useEffect, useState } from 'react';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     fetch('/api/products')
    //         .then((response) => response.json())
    //         .then((data) => setProducts(data))
    //         .catch((error) => console.error('Có lỗi xảy ra:', error));
    // }, []);

    return (
        <div>
            <h1>Danh sách sản phẩm</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - ${product.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductsPage;
