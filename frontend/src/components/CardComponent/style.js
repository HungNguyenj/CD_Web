import styled from "styled-components"
import { Card } from "antd";


export const WrapperCardStyle = styled(Card)`
    width: 100%;
    & img {
        height: 200px;
        width: 100%;
        object-fit: cover;
    }
    .ant-card-body {
        padding: 12px;
    }
    .ant-card-meta-title {
        color: rgb(36, 36, 36);
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        margin: 0;
    }
    .ant-card-meta-description {
        font-size: 20px;
        line-height: 28px;
        margin-top: 4px;
        color: rgb(255, 66, 78);
        font-weight: 500;
    }
    &:hover {
        box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
                    0 3px 6px 0 rgba(0, 0, 0, 0.12),
                    0 5px 12px 4px rgba(0, 0, 0, 0.09);
    }
    border-radius: 8px;
    overflow: hidden;
`;

export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgb(56, 56, 61);
    font-weight: 400;
`

export const WrapperPriceText = styled.div`
    color: rgb(255, 66, 78);
    font-size: 16px;
    font-weight: 500;
`

export const WrapperReportText = styled.div`
    font-size: 11px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    margin: 6px 0 0px;
`

export const WrapperDiscountText = styled.span`
    color: rgb(255, 66, 78);
    font-size: 12px;
    font-weight: 500;
`