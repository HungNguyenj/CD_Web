import React, { useEffect, useState } from "react";
import {
    Table, Button, Layout, Menu, Modal, Form, Input,
    Select, Upload, message, Card, Row, Col
} from "antd";
import {
    UserOutlined, ShoppingCartOutlined, LaptopOutlined, PlusOutlined,
    LogoutOutlined, PieChartOutlined, DownloadOutlined, UploadOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './AdminPage.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState('products');

    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);

    const [productForm] = Form.useForm();
    const [userForm] = Form.useForm();
    const [orderForm] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch("/api/products")
            .then(res => res.json())
            .then(setProducts)
            .catch(console.error);

        fetch("/api/categories")
            .then(res => res.json())
            .then(setCategories)
            .catch(console.error);

        const token = localStorage.getItem('token');
        fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(setUsers)
            .catch(console.error);

        fetch('/api/payments/all', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(setOrders)
            .catch(console.error);
    };

    const getCategoryName = (id) => {
        const category = categories.find(c => String(c.id) === String(id));
        return category ? category.name : "Unknown";
    };

    const handleAddProduct = () => {
        productForm.validateFields().then(values => {
            const productData = {
                name: values.name,
                categoryId: values.categoryId,
                price: values.price,
                sold: values.sold,
                image: values.image?.file?.name || '',
                rating: values.rating,
                discount: values.discount,
            };
            fetch('/api/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })
                .then(res => res.json())
                .then(data => {
                    message.success("Thêm sản phẩm thành công");
                    setProducts([...products, data]);
                    setIsProductModalVisible(false);
                    productForm.resetFields();
                })
                .catch(console.error);
        });
    };

    const handleAddUser = () => {
        userForm.validateFields().then(values => {
            const userData = {
                userName: values.userName,
                phoneNumber: values.phoneNumber,
                address: values.address,
                roles: values.roles
            };
            fetch('/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
                .then(res => res.json())
                .then(data => {
                    message.success("Thêm người dùng thành công");
                    setUsers([...users, data]);
                    setIsUserModalVisible(false);
                    userForm.resetFields();
                })
                .catch(console.error);
        });
    };

    const handleAddOrder = () => {
        orderForm.validateFields().then(values => {
            const orderData = {
                userId: values.userId,
                amount: values.amount,
                method: values.method,
                address: {
                    street: values.street,
                    city: values.city,
                    state: values.state
                }
            };
            fetch('/api/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
                .then(res => res.json())
                .then(data => {
                    message.success("Thêm đơn hàng thành công");
                    setOrders([...orders, data]);
                    setIsOrderModalVisible(false);
                    orderForm.resetFields();
                })
                .catch(console.error);
        });
    };

    const exportStatisticsToExcel = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        const data = [
            { "Chỉ tiêu": "Số lượng sản phẩm", "Giá trị": products.length },
            { "Chỉ tiêu": "Số lượng người dùng", "Giá trị": users.length },
            { "Chỉ tiêu": "Tổng đơn hàng", "Giá trị": orders.length },
            { "Chỉ tiêu": "Tổng doanh thu", "Giá trị": totalRevenue }
        ];

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Thống kê");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "ThongKe.xlsx");
    };

    const productColumns = [
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
        { title: 'Đánh giá', dataIndex: 'rating', key: 'rating' },
        {
            title: 'Danh mục', dataIndex: 'categoryId', key: 'categoryId',
            render: (categoryId) => getCategoryName(categoryId)
        },
    ];

    const userColumns = [
        { title: 'Tên người dùng', dataIndex: 'userName', key: 'userName' },
        { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Vai trò', dataIndex: 'roles', key: 'roles' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    ];

    const orderColumns = [
        { title: 'Mã đơn hàng', dataIndex: 'id', key: 'id' },
        {
            title: 'Người mua', dataIndex: 'user', key: 'user',
            render: (user) => `${user?.userName} (${user?.email})`
        },
        { title: 'Tổng tiền', dataIndex: 'amount', key: 'amount' },
        { title: 'Phương thức', dataIndex: 'method', key: 'method' },
        {
            title: 'Địa chỉ', dataIndex: 'address', key: 'address',
            render: (address) => address ? `${address.street}, ${address.city}, ${address.state}` : ''
        }
    ];

    const renderContent = () => {
        if (selectedMenuItem === 'products') {
            return (
                <>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsProductModalVisible(true)}>Thêm sản phẩm</Button>
                    <Table dataSource={products} columns={productColumns} rowKey="id" pagination={{ pageSize: 5 }} />

                    <Modal
                        title="Thêm sản phẩm"
                        open={isProductModalVisible}
                        onOk={handleAddProduct}
                        onCancel={() => setIsProductModalVisible(false)}
                    >
                        <Form form={productForm} layout="vertical">
                            <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
                                <Select placeholder="Chọn danh mục">
                                    {categories.map(cat => (
                                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="sold" label="Đã bán" initialValue={0}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="rating" label="Đánh giá" initialValue={5}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="discount" label="Giảm giá (%)" initialValue={0}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="image" label="Ảnh sản phẩm" valuePropName="file">
                                <Upload beforeUpload={() => false} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </Upload>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            );
        }

        if (selectedMenuItem === 'users') {
            return (
                <>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsUserModalVisible(true)}>Thêm người dùng</Button>
                    <Table dataSource={users} columns={userColumns} rowKey="id" pagination={{ pageSize: 5 }} />

                    <Modal
                        title="Thêm người dùng"
                        open={isUserModalVisible}
                        onOk={handleAddUser}
                        onCancel={() => setIsUserModalVisible(false)}
                    >
                        <Form form={userForm} layout="vertical">
                            <Form.Item name="userName" label="Tên người dùng" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="address" label="Địa chỉ">
                                <Input />
                            </Form.Item>
                            <Form.Item name="roles" label="Vai trò" initialValue="USER">
                                <Select>
                                    <Option value="USER">USER</Option>
                                    <Option value="ADMIN">ADMIN</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            );
        }

        if (selectedMenuItem === 'orders') {
            return (
                <>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsOrderModalVisible(true)}>Thêm đơn hàng</Button>
                    <Table dataSource={orders} columns={orderColumns} rowKey="id" pagination={{ pageSize: 5 }} />

                    <Modal
                        title="Thêm đơn hàng"
                        open={isOrderModalVisible}
                        onOk={handleAddOrder}
                        onCancel={() => setIsOrderModalVisible(false)}
                    >
                        <Form form={orderForm} layout="vertical">
                            <Form.Item name="userId" label="Người dùng" rules={[{ required: true }]}>
                                <Select placeholder="Chọn người dùng">
                                    {users.map(user => (
                                        <Option key={user.id} value={user.id}>{user.userName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="amount" label="Số tiền" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="method" label="Phương thức thanh toán" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="COD">COD</Option>
                                    <Option value="VNPAY">VNPAY</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="street" label="Đường" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="city" label="Thành phố" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="state" label="Quốc gia" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            );
        }

        if (selectedMenuItem === 'statistics') {
            const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
            return (
                <>
                    <Row gutter={16} style={{ marginBottom: 20 }}>
                        <Col span={6}><Card title="Sản phẩm" bordered><h2>{products.length}</h2></Card></Col>
                        <Col span={6}><Card title="Người dùng" bordered><h2>{users.length}</h2></Card></Col>
                        <Col span={6}><Card title="Đơn hàng" bordered><h2>{orders.length}</h2></Card></Col>
                        <Col span={6}><Card title="Doanh thu" bordered><h2>{totalRevenue.toLocaleString()} VND</h2></Card></Col>
                    </Row>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={exportStatisticsToExcel}>Xuất file Excel</Button>
                </>
            );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = "/login";
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo" style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}> BOOK STORE ADMIN</div>
                <Button style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }} type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
            </Header>
            <Layout>
                <Sider width={200}>
                    <Menu mode="inline" selectedKeys={[selectedMenuItem]} onClick={(e) => setSelectedMenuItem(e.key)}>
                        <Menu.Item key="products" icon={<LaptopOutlined />}>Sản phẩm</Menu.Item>
                        <Menu.Item key="users" icon={<UserOutlined />}>Người dùng</Menu.Item>
                        <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>Đơn hàng</Menu.Item>
                        <Menu.Item key="statistics" icon={<PieChartOutlined />}>Thống kê</Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={{ padding: 24, background: '#fff' }}>
                        {renderContent()}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminPage;
