import React, { useEffect, useState } from "react";
import {
    Table, Button, Layout, Menu, Modal, Form, Input,
    Select, Upload, message, Card, Row, Col, Spin, Image
} from "antd";
import {
    UserOutlined, ShoppingCartOutlined, LaptopOutlined, PlusOutlined,
    LogoutOutlined, PieChartOutlined, DownloadOutlined, UploadOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './AdminPage.css';
import axiosInstance from '../../api/axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { getImageUrl } from '../../utils/imageUtils';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState('products');
    const [loading, setLoading] = useState(false);

    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);

    const [productForm] = Form.useForm();
    const [userForm] = Form.useForm();
    const [orderForm] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, categoriesRes, usersRes, ordersRes] = await Promise.all([
                axiosInstance.get(API_ENDPOINTS.PRODUCTS),
                axiosInstance.get(API_ENDPOINTS.CATEGORIES),
                axiosInstance.get(API_ENDPOINTS.USERS),
                axiosInstance.get(API_ENDPOINTS.ORDERS)
            ]);

            setProducts(Array.isArray(productsRes) ? productsRes : []);
            setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
            setUsers(Array.isArray(usersRes) ? usersRes : []);
            setOrders(Array.isArray(ordersRes) ? ordersRes : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (categoryId) => {
        if (!categoryId) return "Chưa phân loại";
        const category = categories.find(c => String(c.id) === String(categoryId));
        return category ? category.name : "Chưa phân loại";
    };

    const handleAddProduct = async () => {
        try {
            const values = await productForm.validateFields();
            const productData = {
                name: values.name,
                categoryId: values.categoryId,
                price: values.price,
                sold: values.sold,
                image: values.image?.file?.name || '',
                rating: values.rating,
                discount: values.discount,
            };

            const response = await axiosInstance.post(API_ENDPOINTS.PRODUCTS, productData);
            if (response) {
                message.success("Thêm sản phẩm thành công");
                setProducts([...products, response]);
                setIsProductModalVisible(false);
                productForm.resetFields();
                fetchData(); // Refresh data
            }
        } catch (error) {
            console.error('Error adding product:', error);
            message.error('Không thể thêm sản phẩm. Vui lòng thử lại.');
        }
    };

    const handleAddUser = async () => {
        try {
            const values = await userForm.validateFields();
            const userData = {
                username: values.username,
                phoneNumber: values.phoneNumber,
                address: values.address,
                email: values.email,
                password: values.password
            };

            const response = await axiosInstance.post(API_ENDPOINTS.USERS, userData);
            if (response) {
                message.success("Thêm người dùng thành công");
                setUsers([...users, response]);
                setIsUserModalVisible(false);
                userForm.resetFields();
                fetchData(); // Refresh data
            }
        } catch (error) {
            console.error('Error adding user:', error);
            message.error('Không thể thêm người dùng. Vui lòng thử lại.');
        }
    };

    const handleAddOrder = async () => {
        try {
            const values = await orderForm.validateFields();
            const orderData = {
                userId: values.userId,
                totalAmount: values.amount,
                paymentMethod: values.method,
                address: values.address,
                phone: values.phone,
                note: values.note
            };

            const response = await axiosInstance.post(API_ENDPOINTS.ORDERS, orderData);
            if (response) {
                message.success("Thêm đơn hàng thành công");
                setOrders([...orders, response]);
                setIsOrderModalVisible(false);
                orderForm.resetFields();
                fetchData(); // Refresh data
            }
        } catch (error) {
            console.error('Error adding order:', error);
            message.error('Không thể thêm đơn hàng. Vui lòng thử lại.');
        }
    };

    const exportStatisticsToExcel = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
        const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
        const processingOrders = orders.filter(order => order.status === 'PROCESSING').length;

        const data = [
            { "Chỉ tiêu": "Số lượng sản phẩm", "Giá trị": products.length },
            { "Chỉ tiêu": "Số lượng người dùng", "Giá trị": users.length },
            { "Chỉ tiêu": "Tổng đơn hàng", "Giá trị": orders.length },
            { "Chỉ tiêu": "- Đơn hàng hoàn thành", "Giá trị": completedOrders },
            { "Chỉ tiêu": "- Đơn hàng đang xử lý", "Giá trị": processingOrders },
            { "Chỉ tiêu": "- Đơn hàng chờ xử lý", "Giá trị": pendingOrders },
            { "Chỉ tiêu": "Tổng doanh thu", "Giá trị": totalRevenue.toLocaleString('vi-VN') + ' đ' }
        ];

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Thống kê");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "ThongKe.xlsx");
    };

    const productColumns = [
        { 
            title: 'Hình ảnh', 
            dataIndex: 'image', 
            key: 'image',
            render: (image) => (
                <Image 
                    src={getImageUrl(image)}
                    alt="product"
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                    fallback="data:image/png;base64,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"
                />
            )
        },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { 
            title: 'Giá', 
            dataIndex: 'price', 
            key: 'price',
            render: (price) => `${price?.toLocaleString('vi-VN')} đ`
        },
        { 
            title: 'Giảm giá', 
            dataIndex: 'discount', 
            key: 'discount',
            render: (discount) => `${discount}%`
        },
        { title: 'Đã bán', dataIndex: 'sold', key: 'sold' },
        { title: 'Đánh giá', dataIndex: 'rating', key: 'rating' },
        {
            title: 'Danh mục',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (categoryId) => getCategoryName(categoryId)
        },
    ];

    const userColumns = [
        { title: 'Tên người dùng', dataIndex: 'username', key: 'username' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    ];

    const orderColumns = [
        { 
            title: 'Mã đơn hàng', 
            dataIndex: 'id', 
            key: 'id',
            render: (id) => `#${id}`
        },
        { title: 'Người mua', dataIndex: 'user', key: 'user', render: (user) => user?.username },
        { 
            title: 'Tổng tiền', 
            dataIndex: 'totalAmount', 
            key: 'totalAmount',
            render: (amount) => `${amount?.toLocaleString('vi-VN')} đ`
        },
        { 
            title: 'Phương thức', 
            dataIndex: 'paymentMethod', 
            key: 'paymentMethod',
            render: (method) => {
                switch (method) {
                    case 'COD': return 'Thanh toán khi nhận hàng';
                    case 'MOMO': return 'Ví MoMo';
                    case 'VN_PAY': return 'VNPay';
                    case 'ZALO_PAY': return 'ZaloPay';
                    default: return method;
                }
            }
        },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (status) => {
                switch (status) {
                    case 'PENDING': return 'Chờ xử lý';
                    case 'PROCESSING': return 'Đang xử lý';
                    case 'SHIPPED': return 'Đang giao hàng';
                    case 'DELIVERED': return 'Đã giao hàng';
                    case 'CANCELLED': return 'Đã hủy';
                    default: return status;
                }
            }
        }
    ];

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spin size="large" />
                </div>
            );
        }

        if (selectedMenuItem === 'products') {
            return (
                <>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => setIsProductModalVisible(true)}
                        style={{ marginBottom: 16 }}
                    >
                        Thêm sản phẩm
                    </Button>
                    <Table 
                        dataSource={products} 
                        columns={productColumns} 
                        rowKey="id" 
                        pagination={{ pageSize: 10 }}
                    />

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
                            <Form.Item name="username" label="Tên người dùng" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="address" label="Địa chỉ">
                                <Input />
                            </Form.Item>
                            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
                                <Input type="password" />
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
                                        <Option key={user.id} value={user.id}>{user.username}</Option>
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
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="note" label="Ghi chú">
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            );
        }

        if (selectedMenuItem === 'statistics') {
            const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
            const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
            const processingOrders = orders.filter(order => order.status === 'PROCESSING').length;
            
            return (
                <>
                    <Row gutter={16} style={{ marginBottom: 20 }}>
                        <Col span={6}>
                            <Card title="Sản phẩm" bordered>
                                <h2>{products.length}</h2>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="Người dùng" bordered>
                                <h2>{users.length}</h2>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="Đơn hàng" bordered>
                                <h2>{orders.length}</h2>
                                <div style={{ fontSize: '14px', color: '#666' }}>
                                    <div>Hoàn thành: {completedOrders}</div>
                                    <div>Đang xử lý: {processingOrders}</div>
                                    <div>Chờ xử lý: {pendingOrders}</div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="Doanh thu" bordered>
                                <h2>{totalRevenue.toLocaleString('vi-VN')} đ</h2>
                            </Card>
                        </Col>
                    </Row>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={exportStatisticsToExcel}>
                        Xuất file Excel
                    </Button>
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
