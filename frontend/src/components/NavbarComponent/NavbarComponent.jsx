import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { WrapperContent, WrapperLableText, WrapperTextValue } from './style';

const NavBarComponent = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("/api/categories")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Có lỗi xảy ra:", error));
    }, []);

    return (
        <div>
            <WrapperLableText>Danh mục sản phẩm</WrapperLableText>
            <WrapperContent>
                {/* Thêm mục tất cả sản phẩm */}
                <Link style={{ textDecoration: 'none', color: 'black' }} to={`/category/all`}>
                    <WrapperTextValue>Tất cả sản phẩm</WrapperTextValue>
                </Link>

                {/* Render các danh mục từ API */}
                {categories.map((option) => (
                    <Link
                        key={option.id}
                        style={{ textDecoration: 'none', color: 'black' }}
                        to={`/category/${option.id}`}
                    >
                        <WrapperTextValue>{option.name}</WrapperTextValue>
                    </Link>
                ))}
            </WrapperContent>
        </div>
    );
}

export default NavBarComponent;
