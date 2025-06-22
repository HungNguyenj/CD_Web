import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Button, Card, Row, Col, Typography, Divider } from 'antd';
import { CheckCircleFilled, ShoppingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderInfo } = location.state || {};

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    navigate('/orderInfo');
  };

  if (!orderId || !orderInfo) {
    return (
      <Result
        status="404"
        title="Không tìm thấy thông tin đơn hàng"
        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
        extra={
          <Button type="primary" onClick={handleContinueShopping}>
            Tiếp tục mua sắm
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Result
        icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}
        status="success"
        title="Đặt hàng thành công!"
        subTitle={`Mã đơn hàng: #${orderId}`}
        extra={[
          <Button type="primary" key="orders" onClick={handleViewOrder}>
            Xem đơn hàng
          </Button>,
          <Button key="buy" onClick={handleContinueShopping}>
            Tiếp tục mua sắm
          </Button>,
        ]}
      />

      <Card title="Chi tiết đơn hàng" style={{ marginTop: 24 }}>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Title level={5}>Thông tin giao hàng</Title>
            <div style={{ marginTop: 16 }}>
              <Text strong>Địa chỉ: </Text>
              <Text>{orderInfo.address}</Text>
            </div>
            <div style={{ marginTop: 8 }}>
              <Text strong>Số điện thoại: </Text>
              <Text>{orderInfo.phone}</Text>
            </div>
            {orderInfo.note && (
              <div style={{ marginTop: 8 }}>
                <Text strong>Ghi chú: </Text>
                <Text>{orderInfo.note}</Text>
              </div>
            )}
          </Col>
          <Col span={12}>
            <Title level={5}>Phương thức thanh toán</Title>
            <div style={{ marginTop: 16 }}>
              <Text>{orderInfo.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' :
                    orderInfo.paymentMethod === 'MOMO' ? 'Ví MoMo' :
                    orderInfo.paymentMethod === 'VN_PAY' ? 'VNPay' :
                    orderInfo.paymentMethod === 'ZALO_PAY' ? 'ZaloPay' : orderInfo.paymentMethod}</Text>
            </div>
          </Col>
        </Row>

        <Divider />

        <div>
          <Title level={5}>Thông tin đơn hàng</Title>
          {orderInfo.orderItems?.map((item, index) => (
            <Row key={index} style={{ marginTop: 16 }} gutter={16} align="middle">
              <Col span={16}>
                <Text>{item.product.name}</Text>
                <div>
                  <Text type="secondary">Số lượng: {item.quantity}</Text>
                </div>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Text strong>
                  {(item.subtotal || (item.product.price * item.quantity)).toLocaleString('vi-VN')} đ
                </Text>
              </Col>
            </Row>
          ))}

          <Divider />

          <Row justify="space-between" style={{ marginTop: 16 }}>
            <Col>
              <Text strong>Tổng tiền:</Text>
            </Col>
            <Col>
              <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                {orderInfo.totalAmount?.toLocaleString('vi-VN')} đ
              </Text>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccessPage; 