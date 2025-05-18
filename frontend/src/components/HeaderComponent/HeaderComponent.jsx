import React, { useState, useEffect } from "react";
import { Badge, Col, Button, Dropdown, Menu, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { WrapperHeader, WrapperTextHeader, WrapperHearderAccount, WrapperTextHeaderSmall } from './style';
import {
    UserOutlined, CaretDownOutlined, ShoppingCartOutlined,
} from '@ant-design/icons';
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";

const HeaderComponent = () => {
    const [username, setUsername] = useState(null);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }

        const cartItems = JSON.parse(localStorage.getItem("cart_item")) || [];
        setCartCount(cartItems.length);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        setUsername(null);
        navigate("/login");
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
        navigate(`/search-results?keyword=${keyword}`);
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="profile">
                Profile
            </Menu.Item>
            <Menu.Item key="orderInform">
                OrderInform
            </Menu.Item>
            <Menu.Item key="logout">
                Logout
            </Menu.Item>
        </Menu>
    );

    const handleCartClick = () => {
        if (username) {
            navigate("/order");
        } else {
            message.error("Bạn cần đăng nhập để truy cập giỏ hàng");
        }
    };

    const handleAccountClick = () => {
        if (!username) {
            message.error("Bạn cần đăng nhập để truy cập tài khoản");
        }
    };
    const handleLogoClick = () => {
        navigate("/");
    };
    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <div>
            <WrapperHeader>
                <Col span={6} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <WrapperTextHeader>
                        BookStore
                    </WrapperTextHeader>
                </Col>
                <Col span={12}>
                    <ButtonInputSearch
                        size="large"
                        bordered={false}
                        textButton="Tìm kiếm"
                        placeholder="input search text"
                        onSearch={handleSearch}
                        value={keyword}
                        setValue={setKeyword}
                    />
                </Col>
                <Col span={6} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <WrapperHearderAccount onClick={handleAccountClick}>
                        {username ? (
                            <Dropdown overlay={menu} trigger={['click']} onVisibleChange={(flag) => setIsOpenPopup(flag)}>
                                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                    <UserOutlined style={{ fontSize: '30px' }} />
                                    <div>
                                        <WrapperTextHeaderSmall>
                                            {username}
                                        </WrapperTextHeaderSmall>
                                        <div>
                                            <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                            <CaretDownOutlined />
                                        </div>
                                    </div>
                                </div>
                            </Dropdown>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <UserOutlined style={{ fontSize: '30px' }} />
                                <div>
                                    <WrapperTextHeaderSmall onClick={handleLoginClick}>
                                        Đăng nhập / Đăng ký
                                    </WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            </div>
                        )}
                    </WrapperHearderAccount>
                    <div onClick={handleCartClick} style={{ cursor: 'pointer' }}>
                        <Badge count={cartCount} size="small">
                            <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                        </Badge>
                        <WrapperTextHeaderSmall>
                            Giỏ hàng
                        </WrapperTextHeaderSmall>
                    </div>
                </Col>
            </WrapperHeader>
        </div>
    );
};

export default HeaderComponent;
