import React, { useEffect, useState } from "react";
import NavBarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Pagination, Row, Col, Select, Input, Spin, Card, Divider, InputNumber, Button, message } from 'antd';
import { WrapperProducts, WrapperNavbar } from "./style";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

const { Option } = Select;
const { Search } = Input;

const TypeProductPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [initialProducts, setInitialProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [publisherFilter, setPublisherFilter] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [loading, setLoading] = useState(false);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState({ min: null, max: null });

    const fetchCategoryName = async () => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.CATEGORY_BY_ID(categoryId)}`);
            setCategoryName(response.name);
        } catch (error) {
            console.error("Error fetching category name:", error);
        }
    };

    const fetchProducts = async () => {
            setLoading(true);
        try {
            let endpoint = API_ENDPOINTS.PRODUCTS_BY_CATEGORY(categoryId);
            if (priceRange.min !== null && priceRange.max !== null) {
                endpoint = `${API_ENDPOINTS.PRODUCTS_BY_PRICE(categoryId)}?minPrice=${priceRange.min}&maxPrice=${priceRange.max}`;
            }
            const response = await axiosInstance.get(endpoint);
            let sortedProducts = [...response];
            
            switch (sortBy) {
                case 'price-asc':
                    sortedProducts.sort((a, b) => (a.price * (1 - a.discount)) - (b.price * (1 - b.discount)));
                    break;
                case 'price-desc':
                    sortedProducts.sort((a, b) => (b.price * (1 - b.discount)) - (a.price * (1 - a.discount)));
                    break;
                case 'sold':
                    sortedProducts.sort((a, b) => b.sold - a.sold);
                    break;
                case 'rating':
                    sortedProducts.sort((a, b) => b.rating - a.rating);
                    break;
                default:
                    break;
            }
            
            setProducts(sortedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            message.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategoryName();
    }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let filteredProducts = [...initialProducts];

        if (publisherFilter.trim()) {
            filteredProducts = filteredProducts.filter((product) =>
                product.publisher?.toLowerCase().includes(publisherFilter.trim().toLowerCase())
            );
        }

        if (minPrice !== null) {
            filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
        }

        if (maxPrice !== null) {
            filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
        }

        if (sortOption === "sold") {
            filteredProducts.sort((a, b) => b.sold - a.sold);
        } else if (sortOption === "price-asc") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        setProducts(filteredProducts);
        setCurrentPage(1);
    }, [publisherFilter, sortOption, minPrice, maxPrice, initialProducts]);

    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const currentProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSortChange = (value) => {
        setSortBy(value);
        fetchProducts();
    };

    const handlePriceFilter = () => {
        if (priceRange.min > priceRange.max) {
            message.error("Giá tối thiểu không thể lớn hơn giá tối đa");
            return;
        }
        fetchProducts();
    };

    const handleResetFilter = () => {
        setPriceRange({ min: null, max: null });
        setSortBy('default');
        fetchProducts();
    };

    return (
        <div style={{ padding: '40px 80px', background: '#f7f7f7', minHeight: '100vh' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#333', marginBottom: '30px' }}>
                Danh mục: <span style={{ color: '#ff4d4f' }}>{categoryName}</span>
            </h2>

            <Row gutter={[24, 24]}>
                <Col span={5}>
                    {/* DANH MỤC */}
                    <Card title="Danh mục khác" bordered style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <NavBarComponent updateProducts={(filtered) => setInitialProducts(filtered)} />
                    </Card>

                    {/* BỘ LỌC */}
                    <div style={{ marginTop: '20px' }}>
                        <Card title="Bộ lọc sản phẩm" bordered style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontWeight: 500 }}>Nhà xuất bản:</label>
                                <Input
                                    placeholder="Nhập tên NXB"
                                    value={publisherFilter}
                                    onChange={(e) => setPublisherFilter(e.target.value)}
                                    allowClear
                                    style={{ marginTop: '8px' }}
                                />
                            </div>

                            <Divider />

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontWeight: 500 }}>Khoảng giá:</label>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                    <InputNumber
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(value) => setMinPrice(value)}
                                        style={{ width: '100%' }}
                                        min={0}
                                    />
                                    <InputNumber
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(value) => setMaxPrice(value)}
                                        style={{ width: '100%' }}
                                        min={0}
                                    />
                                </div>
                            </div>

                            <Divider />

                            <div>
                                <label style={{ fontWeight: 500 }}>Sắp xếp:</label>
                                <Select
                                    placeholder="Chọn sắp xếp"
                                    style={{ width: '100%', marginTop: '8px' }}
                                    value={sortOption}
                                    onChange={(value) => setSortOption(value)}
                                    allowClear
                                >
                                    <Option value="sold">Bán chạy nhất</Option>
                                    <Option value="price-asc">Giá tăng dần</Option>
                                    <Option value="price-desc">Giá giảm dần</Option>
                                </Select>
                            </div>

                            <Divider />

                            <Button type="default" block onClick={() => {
                                setPublisherFilter("");
                                setMinPrice(null);
                                setMaxPrice(null);
                                setSortOption("");
                            }}>
                                Xóa bộ lọc
                            </Button>
                        </Card>
                    </div>
                </Col>

                <Col span={19}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
                            <WrapperProducts>
                                {currentProducts.length > 0 ? (
                                    currentProducts.map((product) => (
                                        <CardComponent key={product.id} product={product} />
                                    ))
                                ) : (
                                    <p>Không có sản phẩm phù hợp.</p>
                                )}
                            </WrapperProducts>

                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={products.length}
                                onChange={onPageChange}
                                style={{ textAlign: 'center', marginTop: '30px' }}
                                size="large"
                            />
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default TypeProductPage;
