import { Checkbox, Col, Rate, Row, Input, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link ,useParams} from 'react-router-dom';
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue, WrapperLableText1 } from './style'

const NavBarComponent = ({ updateProducts  }) => { 
    const { categoryId } = useParams();
    const [categories, setCategories] = useState([]); // State cho danh sách danh mục
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        fetch("/api/categories")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Có lỗi xảy ra:", error));
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        if (name === 'minPrice') {
            setMinPrice(value);
        } else if (name === 'maxPrice') {
            setMaxPrice(value);
        }
    };

    const filterProductsByPrice = () => {
        if (minPrice && maxPrice) {
            fetch(`/api/categories/${categoryId}/byPrice?minPrice=${minPrice}&maxPrice=${maxPrice}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Filtered products:", data);
                    updateProducts(data);
                })
                .catch((error) => console.error("Có lỗi xảy ra khi lọc sản phẩm theo giá:", error));
        }
    };

    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => (
                    <Link style={{ textDecoration: 'none', color: 'black' }} key={option.id} to={`/category/${option.id}`}>
                        <WrapperTextValue>{option.name}</WrapperTextValue> {/* Tạo liên kết đến trang danh mục */}
                    </Link>
                ));
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox style={{ marginLeft: 0 }} value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option) => {
                    return (
                        <div style={{ dispaly: 'flex' }}>
                            <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                            <span> {`tu ${option}  sao`}</span>
                        </div>
                    )
                })
            case 'price':
                // Xử lý hiển thị danh sách sản phẩm theo mức giá
                return (
                    <>
                        <WrapperLableText>Giá:</WrapperLableText>
                        <WrapperContent>
                            {options.map((option, index) => (
                                <div key={index}>
                                    <WrapperTextPrice>{option.price}</WrapperTextPrice>
                                    <Link to={`/category/${option.id}`}>
                                        <WrapperTextValue>{option.name}</WrapperTextValue>
                                    </Link>
                                </div>
                            ))}
                        </WrapperContent>
                    </>
                );
            default:
                return {}
        }
    }


    return (
        <div>
            <WrapperLableText>Danh mục sản phẩm</WrapperLableText>
            <WrapperContent>
                {renderContent('text', categories)}
            </WrapperContent>

            <WrapperLableText1>Lọc theo giá</WrapperLableText1>
            <WrapperContent>
                <Row gutter={16}>
                    <Col span={12}>
                        <Input type="number" name="minPrice" placeholder="Giá tối thiểu" value={minPrice} onChange={onChange} />
                    </Col>
                    <Col span={12}>
                        <Input type="number" name="maxPrice" placeholder="Giá tối đa" value={maxPrice} onChange={onChange} />
                    </Col>
                </Row>
                <Button onClick={filterProductsByPrice}>Lọc</Button>
            </WrapperContent>

        </div>
    )
}

export default NavBarComponent