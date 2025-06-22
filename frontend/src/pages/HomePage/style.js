import { Row } from 'antd';
import styled from 'styled-components';

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperPage = styled.div`
    padding: 24px 120px;
    background-color: #f5f5f5;
    min-height: 100vh;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
        justify-content: flex-start;
    border-bottom: 1px solid rgb(242, 242, 242);
    padding: 0 0 10px;
        overflow-x: auto;
    &::-webkit-scrollbar {
        height: 0;
    }
`;

// Thêm styled component cho từng item category
export const CategoryItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: #fff;
    border: 2px solid transparent;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    box-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    position: relative;
    overflow: hidden;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    letter-spacing: 0.3px;
    color: #2c3e50;

    /* Icon styling */
    .anticon {
        font-size: 16px;
        transition: transform 0.3s ease;
    }

    /* Hover effects */
    &:hover {
        transform: translateY(-3px);
        box-shadow: 
            0 6px 20px rgba(24, 144, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            0 1px 3px rgba(0, 0, 0, 0.1);
        border-color: #1890ff;
        background: linear-gradient(135deg, #fff 0%, #f0f8ff 100%);
        text-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.15),
            0 0 10px rgba(24, 144, 255, 0.3);
        color: #1890ff;
        font-weight: 700;
        
        .anticon {
            transform: scale(1.15);
            filter: drop-shadow(0 2px 4px rgba(24, 144, 255, 0.3));
        }
    }

    /* Active state */
    &.active {
        background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
        color: #fff;
        border-color: #1890ff;
        box-shadow: 
            0 6px 20px rgba(24, 144, 255, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1);
        text-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.3),
            0 0 8px rgba(255, 255, 255, 0.3);
        font-weight: 700;
        transform: translateY(-1px);
        
        .anticon {
            color: #fff;
            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }
    }

    /* Focus state for accessibility */
    &:focus-visible {
        outline: 2px solid #1890ff;
        outline-offset: 2px;
    }

    @media (max-width: 768px) {
        padding: 10px 16px;
        font-size: 13px;
        min-width: fit-content;
        
        .anticon {
            font-size: 14px;
        }
    }

    @media (max-width: 480px) {
        padding: 8px 14px;
        font-size: 12px;
        
        .anticon {
            font-size: 12px;
        }
    }
`;

// Component cho text nổi bật đặc biệt
export const HighlightText = styled.span`
    background: linear-gradient(45deg, #1890ff, #52c41a, #faad14);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
    text-shadow: none;
    animation: shimmer 3s ease-in-out infinite;
    background-size: 200% 200%;
    
    @keyframes shimmer {
        0%, 100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }
`;

// Component cho text có hiệu ứng 3D
export const Text3D = styled.span`
    color: #2c3e50;
    text-shadow: 
        1px 1px 0px #34495e,
        2px 2px 0px #34495e,
        3px 3px 0px #34495e,
        4px 4px 8px rgba(0, 0, 0, 0.3);
    font-weight: 700;
    letter-spacing: 1px;
    transform: perspective(500px) rotateX(15deg);
    display: inline-block;
    transition: all 0.3s ease;
    
    &:hover {
        transform: perspective(500px) rotateX(0deg) scale(1.05);
        text-shadow: 
            1px 1px 0px #1890ff,
            2px 2px 0px #1890ff,
            3px 3px 0px #1890ff,
            4px 4px 12px rgba(24, 144, 255, 0.5);
        color: #1890ff;
    }
`;

// Component cho text phát sáng
export const GlowText = styled.span`
    color: #fff;
    text-shadow: 
        0 0 5px #1890ff,
        0 0 10px #1890ff,
        0 0 15px #1890ff,
        0 0 20px #1890ff,
        0 0 35px #1890ff,
        0 0 40px #1890ff;
    font-weight: 700;
    animation: glow 2s ease-in-out infinite alternate;
    
    @keyframes glow {
        from {
            text-shadow: 
                0 0 5px #1890ff,
                0 0 10px #1890ff,
                0 0 15px #1890ff,
                0 0 20px #1890ff,
                0 0 35px #1890ff,
                0 0 40px #1890ff;
        }
        to {
            text-shadow: 
                0 0 2px #52c41a,
                0 0 5px #52c41a,
                0 0 8px #52c41a,
                0 0 12px #52c41a,
                0 0 18px #52c41a,
                0 0 25px #52c41a;
        }
    }
`;

// Loading skeleton cho categories
export const CategorySkeleton = styled.div`
    display: flex;
    gap: 16px;
    padding: 24px;
    justify-content: center;
    flex-wrap: wrap;

    .skeleton-item {
        width: 120px;
        height: 44px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 25px;
    }

    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    @media (max-width: 768px) {
        justify-content: flex-start;
        overflow-x: auto;
        flex-wrap: nowrap;
        
        .skeleton-item {
            min-width: 100px;
            width: 100px;
        }
    }
`;

export const WrapperProducts = styled.div`
    display: flex;
    gap: 14px;
    margin-top:20px;
    flex-wrap: wrap;
`;

export const WrapperButtonMore = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

export const WrapperFeatured = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
                0 1px 6px -1px rgba(0, 0, 0, 0.02),
                0 2px 4px 0 rgba(0, 0, 0, 0.02);
`;

export const FeaturedTitle = styled.h2`
    font-size: 24px;
  color: #333;
    margin-bottom: 20px;
    text-align: center;
`;