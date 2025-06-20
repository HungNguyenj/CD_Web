import styled from "styled-components";
import { Row, Col } from 'antd';

export const HeaderContainer = styled.div`
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
`;

export const WrapperHeader = styled(Row)`
    padding: 12px 60px;
    background: transparent;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 70px;

    @media (max-width: 1200px) {
        padding: 12px 40px;
    }

    @media (max-width: 768px) {
        padding: 12px 20px;
        min-height: 60px;
    }
`;

export const LogoSection = styled(Col)`
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 8px 12px;
    border-radius: 8px;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
    }

    @media (max-width: 768px) {
        padding: 4px 8px;
    }
`;

export const WrapperTextHeader = styled.span`
    font-size: 24px;
    color: #fff;
    font-weight: 700;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

export const SearchSection = styled(Col)`
    padding: 0 20px;
    
    @media (max-width: 768px) {
        padding: 0 10px;
    }
`;

export const AccountSection = styled(Col)`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    
    @media (max-width: 768px) {
        gap: 15px;
    }
`;

export const UserSection = styled.div`
    .user-dropdown, .login-section {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 8px;
        transition: all 0.3s ease;
        gap: 10px;
        
        &:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-1px);
        }
    }
    
    .user-info, .login-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    
    .username {
        font-weight: 600;
        font-size: 13px;
        margin-bottom: 2px;
    }
    
    .account-text, .login-text {
        font-size: 11px;
        opacity: 0.9;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    @media (max-width: 768px) {
        .user-info, .login-info {
            display: none;
        }
    }
`;

export const LoginSection = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.3s ease;
    gap: 10px;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
    }
    
    .login-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    
    .login-text {
        font-weight: 600;
        font-size: 13px;
        margin-bottom: 2px;
    }
    
    .account-text {
        font-size: 11px;
        opacity: 0.9;
    }
    
    @media (max-width: 768px) {
        .login-info {
            display: none;
        }
    }
`;

export const CartSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }
    
    .cart-icon {
        font-size: 26px;
        color: #fff;
        margin-bottom: 4px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    .cart-text {
        font-size: 11px;
        font-weight: 500;
    }
    
    @media (max-width: 768px) {
        .cart-text {
            display: none;
        }
        
        .cart-icon {
            margin-bottom: 0;
        }
    }
`;

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
`;

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    
    &.username {
        font-weight: 600;
        font-size: 13px;
    }
    
    &.login-text {
        font-weight: 600;
        font-size: 13px;
    }
    
    &.account-text {
        font-size: 11px;
        opacity: 0.9;
    }
    
    &.cart-text {
        font-weight: 500;
        font-size: 11px;
    }
`;
export const CategorySection = styled.div`
  margin-left: 20px;
  cursor: pointer;
`;