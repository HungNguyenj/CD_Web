import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Image, Row, Col, message, Spin } from "antd";
import { DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { getImageUrl } from "../../utils/imageUtils";
import debounce from 'lodash/debounce';

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_ENDPOINTS.CART);
      console.log('Cart response:', response);

      if (response?.cartItemList) {
        if (Array.isArray(response.cartItemList)) {
          setCartItems(response.cartItemList);
        } else {
          console.error("Dữ liệu không phải là mảng:", response.cartItemList);
          message.error("Có lỗi khi tải giỏ hàng");
        }
      } else if (response?.data?.cartItemList) {
        if (Array.isArray(response.data.cartItemList)) {
          setCartItems(response.data.cartItemList);
        } else {
          console.error("Dữ liệu không phải là mảng:", response.data.cartItemList);
          message.error("Có lỗi khi tải giỏ hàng");
        }
      } else {
        console.log('No cartItemList found in response:', response);
        setCartItems([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
      message.error("Không thể tải giỏ hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedUpdateQuantity = useCallback(
    debounce(async (cartItemId, changeAmount) => {
      try {
        const response = await axiosInstance.put(`/carts`, {
          cartItemId: cartItemId,
          quantity: changeAmount
        });

        console.log('Update response:', response);
        
        if (response) {
          await fetchCartItems();
          message.success("Cập nhật số lượng thành công");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
        message.error(error.message || "Không thể cập nhật số lượng. Vui lòng thử lại.");
        await fetchCartItems();
      } finally {
        setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
      }
    }, 300),
    []
  );

  const handleQuantityChange = async (itemId, change) => {
    if (updatingItems[itemId]) return;

    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1 || newQuantity > 99) return;

    // Set loading state
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

    // Optimistic update
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
    
    // Gửi giá trị thay đổi (1 hoặc -1)
    debouncedUpdateQuantity.cancel();
    debouncedUpdateQuantity(itemId, change); // change sẽ là 1 hoặc -1
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.CART_ITEM(itemId));
      await fetchCartItems();
        message.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Không thể xóa sản phẩm. Vui lòng thử lại.");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning("Giỏ hàng của bạn đang trống");
      return;
    }

    // Tính tổng tiền
    const total = cartItems.reduce((sum, item) => {
      const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
      return sum + Math.round(discountedPrice * item.quantity);
    }, 0);

    // Chuyển đến trang checkout với thông tin giỏ hàng
    navigate('/checkout', {
      state: {
        cartItems: cartItems,
        totalAmount: total,
        itemCount: cartItems.length
      }
    });
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["product", "name"],
      key: "product",
      render: (text, record) => (
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Image
              src={getImageUrl(record.product.image)}
              alt={record.product.name}
              width={80}
              style={{ objectFit: 'cover', borderRadius: '4px' }}
            />
          </Col>
          <Col span={16}>
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>{record.product.name}</div>
            <div style={{ color: '#666' }}>{record.product.author}</div>
          </Col>
        </Row>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: ["product", "price"],
      key: "price",
      render: (text, record) => {
        const discountedPrice = record.product.price * (1 - (record.product.discount || 0) / 100);
        return (
          <div>
            <div style={{ color: '#ff4d4f', fontWeight: '500' }}>
              {Math.round(discountedPrice).toLocaleString('vi-VN')} đ
            </div>
            {record.product.discount > 0 && (
              <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '12px' }}>
                {record.product.price.toLocaleString('vi-VN')} đ
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(record.id, -1)}
            disabled={updatingItems[record.id] || record.quantity <= 1}
            size="small"
          />
          <span style={{ minWidth: '32px', textAlign: 'center' }}>{record.quantity}</span>
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(record.id, 1)}
            disabled={updatingItems[record.id] || record.quantity >= 99}
            size="small"
          />
          {updatingItems[record.id] && (
            <Spin size="small" style={{ marginLeft: '8px' }} />
          )}
        </div>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: ["product", "price"],
      key: "total",
      render: (text, record) => {
        const discountedPrice = record.product.price * (1 - (record.product.discount || 0) / 100);
        return (
          <span style={{ color: '#ff4d4f', fontWeight: '500' }}>
            {Math.round(discountedPrice * record.quantity).toLocaleString('vi-VN')} đ
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id)}
          style={{ borderRadius: '4px' }}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Giỏ hàng của bạn</h2>
      <Table
        columns={columns}
        dataSource={cartItems}
        rowKey="id"
        pagination={false}
        loading={loading}
        locale={{
          emptyText: 'Giỏ hàng trống'
        }}
        summary={(pageData) => {
          let total = 0;
          pageData.forEach(({ product, quantity }) => {
            const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
            total += Math.round(discountedPrice * quantity);
          });
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Tổng tiền</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <span style={{ color: '#ff4d4f', fontSize: '18px', fontWeight: '700' }}>
                  {total.toLocaleString('vi-VN')} đ
                </span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
      <div style={styles.checkoutContainer}>
        <Button
          type="primary"
          size="large"
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || loading}
          style={styles.checkoutButton}
        >
          Thanh toán ({cartItems.length} sản phẩm)
        </Button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    margin: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1890ff'
  },
  checkoutContainer: {
    marginTop: '24px',
    textAlign: 'right',
    padding: '16px',
    borderTop: '1px solid #f0f0f0'
  },
  checkoutButton: {
    height: '48px',
    padding: '0 32px',
    fontSize: '16px',
    fontWeight: '500',
    borderRadius: '6px'
  }
};

export default OrderPage;
