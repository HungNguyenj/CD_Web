import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Typography, Card, message } from 'antd';
import axiosInstance from '../../api/axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const { Title } = Typography;

const OrderInfoPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_ENDPOINTS.ORDERS);
            setOrders(response || []);
        } catch (error) {
            message.error('Không thể tải danh sách đơn hàng');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'gold';
            case 'PROCESSING':
                return 'blue';
            case 'SHIPPED':
                return 'cyan';
            case 'DELIVERED':
                return 'green';
            case 'CANCELLED':
                return 'red';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xử lý';
            case 'PROCESSING':
                return 'Đang xử lý';
            case 'SHIPPED':
                return 'Đang giao hàng';
            case 'DELIVERED':
                return 'Đã giao hàng';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'COD':
                return 'Thanh toán khi nhận hàng';
            case 'MOMO':
                return 'Ví MoMo';
            case 'VN_PAY':
                return 'VNPay';
            case 'ZALO_PAY':
                return 'ZaloPay';
            default:
                return method;
        }
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            render: (id) => `#${id}`,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => `${amount?.toLocaleString('vi-VN')} đ`,
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (method) => getPaymentMethodText(method),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        }
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
            <Card>
                <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
                    Đơn hàng của tôi
                </Title>
                <Table 
                    columns={columns} 
                    dataSource={orders} 
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        position: ['bottomCenter'],
                        showSizeChanger: false
                    }}
                />
            </Card>
        </div>
    );
};

export default OrderInfoPage;
