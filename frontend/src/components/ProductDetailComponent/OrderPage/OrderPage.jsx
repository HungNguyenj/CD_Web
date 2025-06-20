import React, { useEffect, useState } from "react";
import { Table, Button, InputNumber, Image, Row, Col, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = () => {
        fetch("/api/cart", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCartItems(data);
                } else {
                    console.error("Dữ liệu không phải là mảng:", data);
                }
            })
            .catch((error) => console.error("Có lỗi xảy ra:", error));
    };

    const handleQuantityChange = (productId, quantity) => {
        fetch(`/api/cart/${productId}?quantity=${quantity}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ quantity }),
        })
            .then((response) => response.json())
            .then((data) => {
                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === productId ? { ...item, quantity: data.quantity } : item
                    )
                );
                message.success("Cập nhật số lượng thành công");
            })
            .catch((error) => console.error("Có lỗi xảy ra:", error));
    };

    const handleRemoveItem = (productId) => {
        fetch(`/api/cart/${productId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(() => {
                setCartItems((prevItems) =>
                    prevItems.filter((item) => item.id !== productId)
                );
                message.success("Xóa sản phẩm thành công");
            })
            .catch((error) => console.error("Có lỗi xảy ra:", error));
    };

    const handleCheckout = () => {
        const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        navigate("/checkout", { state: { fromCart: true, totalAmount: total } });
    };

    const imagePath = '/assets/images/';

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "product",
            key: "product",
            render: (text, record) => (
                <Row>
                    <Col span={6}>
                        <Image src={imagePath + record.product.image} alt={record.product.name} width={50} />
                    </Col>
                    <Col span={18}>
                        <span>{record.product.name}</span>
                    </Col>
                </Row>
            ),
        },
        {
            title: "Đơn giá",
            dataIndex: "product",
            key: "price",
            render: (text, record) => `${record.product.price.toLocaleString()} đ`,
        },
        {
            title: "Số lượng",
            key: "quantity",
            render: (text, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record.id, value)}
                />
            ),
        },
        {
            title: "Thành tiền",
            key: "total",
            render: (text, record) => `${(record.product.price * record.quantity).toLocaleString()} đ`,
        },
        {
            title: "Hành động",
            key: "action",
            render: (text, record) => (
                <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleRemoveItem(record.id)} />
            ),
        },
    ];

    return (
        <div style={{ padding: "16px", background: "#fff", borderRadius: "8px" }}>
            <h2>Giỏ hàng của bạn</h2>
            <Table
                columns={columns}
                dataSource={cartItems}
                rowKey="id"
                pagination={false}
                summary={(pageData) => {
                    let total = 0;
                    pageData.forEach(({ product, quantity }) => {
                        total += product.price * quantity;
                    });
                    return (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={3}><b>Tổng cộng</b></Table.Summary.Cell>
                            <Table.Summary.Cell><b>{total.toLocaleString()} đ</b></Table.Summary.Cell>
                            <Table.Summary.Cell></Table.Summary.Cell>
                        </Table.Summary.Row>
                    );
                }}
            />
            <div style={{ marginTop: "16px", textAlign: "right" }}>
                <Button type="primary" onClick={handleCheckout}>
                    Thanh toán
                </Button>
            </div>
        </div>
    );
};

export default OrderPage;
