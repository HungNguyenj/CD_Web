import React, { useState, useEffect } from 'react';
import { Table, Button, Space } from 'antd';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);



    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        const token = localStorage.getItem('token');
        fetch('/api/payments/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Orders data:', data); // Log data received from API
                setOrders(data);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (user) => `${user.userName} (${user.email})`,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => {
                const address = record.address;
                return address ? `${address.street}, ${address.city}, ${address.state}` : '';
            }
        },
    ];

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>My Orders</h2>
            <Table columns={columns} dataSource={orders} rowKey="id" />
        </div>
    );
};

export default OrderPage;
