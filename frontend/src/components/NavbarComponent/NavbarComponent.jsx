import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { WrapperContent, WrapperLableText, WrapperTextValue } from './style';
import axiosInstance from '../../api/axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { message } from 'antd';

const NavBarComponent = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await axiosInstance.get(API_ENDPOINTS.CATEGORIES);
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                message.error("Không thể tải danh mục sản phẩm");
            }
        };
        fetchCategories();
    }, []);

    return (
        <div>
            <WrapperLableText>Danh mục sản phẩm</WrapperLableText>
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
