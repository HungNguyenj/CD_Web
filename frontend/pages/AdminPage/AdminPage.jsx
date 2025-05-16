import React, { useEffect, useState } from "react";
import { Table, Button, Layout, Menu, Space, Modal, Form, Input, Select, Upload } from "antd";
import { UserOutlined, ShoppingCartOutlined, LaptopOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './AdminPage.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]); 
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [selectedMenuItem, setSelectedMenuItem] = useState('products');
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [orders, setOrders] = useState([]);

    const handleEditClick = user => {
        setEditingUser(user);
        editForm.setFieldsValue(user);
        setIsEditModalVisible(true);
    };

    const handleDeleteClick = async (userId) => {
        await fetch(`/delete/${userId}`, {
            method: 'DELETE',
        });
        fetchUsers();
    };

    const handleEditOk = () => {
        editForm.validateFields()
            .then(values => {
                editForm.resetFields();
                fetch(`/update/${editingUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    setUsers(users.map(user => user.id === data.id ? data : user));
                    setIsEditModalVisible(false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };
    const fetchOrders = () => {
        const token = localStorage.getItem('token');
        fetch('/api/payments/all', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setOrders(data); // setOrders là state quản lý danh sách đơn hàng
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    };

    useEffect(() => {
        fetch("/api/products")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error fetching products:", error));
        fetchUsers();
        fetchOrders();
    }, []);

    const fetchUsers = () => {
        const token = localStorage.getItem('token');

        fetch('/api/users', {
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
            setUsers(data);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                form.resetFields();
                const productData = {
                    name: values.name,
                    categoryId: values.type,
                    price: values.price,
                    sold: values.sold,
                    image: values.image ? values.image[0].name : '',
                    rating: values.rating,
                    discount: values.discount,
                };
                fetch('/api/products/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    setProducts([...products, data]);
                    setIsModalVisible(false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleMenuClick = e => {
        setSelectedMenuItem(e.key);
    };

    const userColumns = [
        {
            title: 'Gmail',
            dataIndex: 'userName',
            key: 'name',
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'roles',
            key: 'email',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        // {
        //     title: 'Admin',
        //     dataIndex: 'isAdmin',
        //     key: 'isAdmin',
        //     render: (text, record) => (record.isAdmin ? 'TRUE' : 'FALSE'),
        // },
        // {
        //     title: 'Phone',
        //     dataIndex: 'phone',
        //     key: 'phone',
        // },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick = {() => handleEditClick(record)} />
                    <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record.id)} />
                </Space>
            ),
        },
    ];

    const productColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} />
                    <Button type="danger" icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];
    const orderColumns = [
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
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} />
                    <Button type="danger" icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    const renderContent = () => {
        if (selectedMenuItem === 'users') {
            return (
                <div className="user-management">
                    <Button type="primary" style={{ marginBottom: '16px' }}>Export Excel</Button>
                    <Table dataSource={users} columns={userColumns} pagination={{ pageSize: 5 }} />
                </div>
            );
        } else if (selectedMenuItem === 'products') {
            return (
                <div className="product-management">
                    <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={showModal} />
                    <Button type="primary" style={{ marginLeft: '10px' }}>Export Excel</Button>
                    <Table dataSource={products} columns={productColumns} pagination={{ pageSize: 5 }} />
                </div>
            );
        } else if (selectedMenuItem === 'orders') {
            return (
                <div className="order-management">
                    <Button type="primary" style={{ marginBottom: '16px' }}>Export Excel</Button>
                    <Table dataSource={orders} columns={orderColumns} pagination={{ pageSize: 5 }} />
                </div>
            );
        } else {
            return <div>Content will be added later</div>;
        }
    };


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="header">
                <div className="logo">BOOK STORE</div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['products']}
                        selectedKeys={[selectedMenuItem]}
                        onClick={handleMenuClick}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item key="users" icon={<UserOutlined />}>
                            Người dùng
                        </Menu.Item>
                        <Menu.Item key="products" icon={<LaptopOutlined />}>
                            Sản phẩm
                        </Menu.Item>
                        <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
                            Đơn hàng
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {renderContent()}
                    </Content>
                </Layout>
            </Layout>

            <Modal title="Tạo sản phẩm" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical" name="form_in_modal">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name of the product!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please select the type of the product!' }]}
                    >
                        <Select placeholder="Select a type">
                            <Option value="1">Category 1</Option>
                            <Option value="2">Category 2</Option>
                            <Option value="3">Category 3</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: 'Please input the price of the product!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="sold"
                        label="Sold"
                        rules={[{ required: true, message: 'Please input the sold count!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Image"
                        valuePropName="fileList"
                        getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                        rules={[{ required: true, message: 'Please select an image!' }]}
                    >
                        <Upload name="image" listType="picture" beforeUpload={() => false}>
                            <Button>Select File</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="rating"
                        label="Rating"
                        rules={[{ required: true, message: 'Please input the rating of the product!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="discount"
                        label="Discount"
                        rules={[{ required: true, message: 'Please input the discount of the product!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Cập nhật thông tin người dùng" visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
                <Form form={editForm} layout="vertical" name="form_in_modal">
                    <Form.Item
                        name="phoneNumber"
                        label="phone"
                        rules={[{ required: true, message: 'Please input the email of the user!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Please input the phone number of the user!' }]}
                    >
                        <Input />
                    </Form.Item>
            
                </Form>
            </Modal>

        </Layout>
    );
};

export default AdminPage;
