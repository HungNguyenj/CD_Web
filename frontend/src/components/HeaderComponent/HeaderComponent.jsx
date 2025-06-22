import React, { useState, useEffect } from "react";
import { Badge, Col, Dropdown, Menu, message, Avatar, Button, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
    BookOutlined,
    AppstoreOutlined,
    DownOutlined
} from '@ant-design/icons';
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { HeaderContainer, WrapperHeader, WrapperTextHeader, WrapperTextHeaderSmall } from './style';

const HeaderComponent = () => {
    const [username, setUsername] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
        const cartItems = JSON.parse(localStorage.getItem("cart_item")) || [];
        setCartCount(cartItems.length);
        const data = [
            { id: 1, name: "Tiểu thuyết" },
            { id: 2, name: "Truyện ngắn" },
            { id: 3, name: "Trinh thám"},
            { id: 4, name: "Tình cảm" },
            { id: 5, name: "Lịch sử" },
        ];
        setCategories(data);
    }, []);

    const handleLogout = () => {
        // Clear all user-related data from localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("cart_item");
        setUsername(null);
        setCartCount(0);
        navigate("/login");
        message.success("Đăng xuất thành công!");
    };

    const handleMenuClick = ({ key }) => {
        switch (key) {
            case "profile":
                navigate("/profile");
                break;
            case "orderInform":
                navigate("/orderInfo");
                break;
            case "logout":
                handleLogout();
                break;
            default:
                break;
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search-results?keyword=${keyword}`);
        } else {
            message.warning("Vui lòng nhập từ khóa tìm kiếm");
        }
    };

    const handleCartClick = () => {
        if (username) {
            navigate("/order");
        } else {
            message.error("Bạn cần đăng nhập để truy cập giỏ hàng");
        }
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    const categoryMenu = (
        <Menu onClick={({ key }) => navigate(`/category/${key}`)}>
            {categories.map(category => (
                <Menu.Item key={category.id}>{category.name}</Menu.Item>
            ))}
        </Menu>
    );

    const accountMenu = (
        <Menu onClick={handleMenuClick} style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                Thông tin cá nhân
            </Menu.Item>
            <Menu.Item key="orderInform" icon={<ShoppingCartOutlined />}>
                Đơn hàng của tôi
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" danger>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <HeaderContainer>
            <WrapperHeader>
                <Row align="middle" justify="space-between" style={{ width: '100%' }}>

                    {/* Logo */}
                    <Col>
                        <div onClick={() => navigate("/")} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <BookOutlined style={{ fontSize: '28px', marginRight: '8px', color: '#1890ff' }} />
                            <WrapperTextHeader>BookStore</WrapperTextHeader>
                        </div>
                    </Col>

                    {/* Danh mục sản phẩm */}
                    <Col>
                        <Dropdown overlay={categoryMenu} trigger={['click']}>
                            <Button
                                icon={<AppstoreOutlined />}
                                style={{
                                    border: 'none',
                                    boxShadow: 'none',
                                    borderRadius: '0px',
                                    backgroundColor: 'transparent',
                                    color: '#fff',
                                    fontWeight: 500,
                                    height: '40px',
                                    padding: '0 20px'
                                }}
                            >
                                Danh mục
                            </Button>
                        </Dropdown>


                    </Col>

                    {/* Search */}
                    <Col style={{ flex: 1, marginLeft: '20px', marginRight: '20px' }}>
                        <ButtonInputSearch
                            size="large"
                            bordered={false}
                            textButton="Tìm kiếm"
                            placeholder="Tìm kiếm sách, tác giả..."
                            onSearch={handleSearch}
                            value={keyword}
                            setValue={setKeyword}
                        />
                    </Col>

                    {/* Account + Cart */}
                    <Col>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {username ? (
                                <Dropdown overlay={accountMenu} trigger={['click']} placement="bottomRight">
                                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <Avatar size={36} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                                        <div style={{ marginLeft: '10px' }}>
                                            <WrapperTextHeaderSmall>{username}</WrapperTextHeaderSmall>
                                            <WrapperTextHeaderSmall>Tài khoản <CaretDownOutlined /></WrapperTextHeaderSmall>
                                        </div>
                                    </div>
                                </Dropdown>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLoginClick}>
                                    <Avatar size={36} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                                    <div style={{ marginLeft: '10px' }}>
                                        <WrapperTextHeaderSmall>Đăng nhập</WrapperTextHeaderSmall>
                                        <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                    </div>
                                </div>
                            )}

                            <div onClick={handleCartClick} style={{ cursor: 'pointer' }}>
                                <Badge count={cartCount} size="small" style={{ backgroundColor: '#ff4d4f' }}>
                                    <ShoppingCartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                </Badge>
                                <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                            </div>
                        </div>
                    </Col>
                </Row>
            </WrapperHeader>
        </HeaderContainer>
    );
};

export default HeaderComponent;
