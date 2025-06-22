import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Radio,
  message,
  Steps,
  Image,
  Space
} from 'antd';
import { getImageUrl } from '../../utils/imageUtils';
import axiosInstance from '../../api/axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const CheckoutPage = () => {
  const location = useLocation();
    const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Lấy thông tin giỏ hàng từ state
  const cartData = location.state;

    useEffect(() => {
    // Kiểm tra đăng nhập
        const token = localStorage.getItem('token');
        if (!token) {
      message.error('Vui lòng đăng nhập để đặt hàng');
      navigate('/login', { 
        state: { 
          from: location.pathname,
          cartData: cartData 
        }
      });
      return;
    }

    // Kiểm tra dữ liệu giỏ hàng
    if (!cartData || !cartData.cartItems || cartData.cartItems.length === 0) {
      message.error('Không có thông tin giỏ hàng');
      navigate('/cart');
      return;
    }

    // Load thông tin user
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER_PROFILE);
      if (response) {
        form.setFieldsValue({
          fullName: response.username,
          phone: response.phoneNumber,
          address: response.address,
          email: response.email
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin user:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login', { 
          state: { 
            from: location.pathname,
            cartData: cartData 
          }
        });
      }
    }
  };

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để đặt hàng');
        navigate('/login', { 
          state: { 
            from: location.pathname,
            cartData: cartData 
          }
        });
        return;
      }

      setLoading(true);
      
      // Tạo order request theo format backend yêu cầu
      const orderRequest = {
        address: values.address,
        note: values.note || "",
        phone: values.phone,
        paymentMethod: values.paymentMethod || "COD"
      };

      console.log('Sending order request:', orderRequest);

      // Gọi API tạo đơn hàng
      const orderData = await axiosInstance.post(API_ENDPOINTS.ORDERS, orderRequest);
      
      console.log('Order response:', orderData);

      // Kiểm tra response - orderData là đã được unwrap bởi axios interceptor
      if (orderData) {
        message.success('Đặt hàng thành công!');
        
        // Chuyển đến trang thành công với thông tin đơn hàng
        navigate('/order-success', { 
          state: { 
            orderId: orderData?.id,
            orderInfo: {
              ...orderData,
              address: values.address,
              phone: values.phone,
              note: values.note,
              paymentMethod: values.paymentMethod
            }
          } 
        });
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      
      // Xử lý các loại lỗi
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login', { 
          state: { 
            from: location.pathname,
            cartData: cartData 
          }
        });
      } else {
        message.error(
          error.response?.data?.message || 
          error.message || 
          'Không thể đặt hàng. Vui lòng thử lại sau.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Thông tin giao hàng',
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            paymentMethod: 'COD'
          }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Card title="Thông tin giao hàng" bordered={false}>
                <Form.Item
                  name="fullName"
                  label="Họ tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                  <Input placeholder="Nhập họ tên người nhận" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <Input.TextArea
                    placeholder="Nhập địa chỉ giao hàng"
                    rows={3}
                  />
                </Form.Item>

                <Form.Item
                  name="note"
                  label="Ghi chú"
                >
                  <Input.TextArea
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                    rows={3}
                  />
                </Form.Item>
              </Card>

              <Card title="Phương thức thanh toán" bordered={false} style={{ marginTop: '20px' }}>
                <Form.Item name="paymentMethod">
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                      <Radio value="MOMO">Ví MoMo</Radio>
                      <Radio value="VN_PAY">VNPay</Radio>
                      <Radio value="ZALO_PAY">ZaloPay</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Thông tin đơn hàng" bordered={false}>
                <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                  {cartData?.cartItems?.map((item) => (
                    <div key={item.id} style={{ marginBottom: '15px' }}>
                      <Row gutter={8} align="middle">
                        <Col span={8}>
                          <Image
                            src={getImageUrl(item.product.image)}
                            alt={item.product.name}
                            width="100%"
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </Col>
                        <Col span={16}>
                          <div style={{ fontWeight: '500' }}>{item.product.name}</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>
                            Số lượng: {item.quantity}
                          </div>
                          <div style={{ color: '#ff4d4f', marginTop: '4px' }}>
                            {Math.round(item.product.price * (1 - (item.product.discount || 0) / 100) * item.quantity).toLocaleString('vi-VN')} đ
                                    </div>
                        </Col>
                      </Row>
                                </div>
                            ))}
                        </div>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ marginBottom: '12px' }}>
                  <Row justify="space-between">
                    <Col>Tạm tính:</Col>
                    <Col style={{ fontWeight: '500' }}>
                      {cartData?.totalAmount?.toLocaleString('vi-VN')} đ
                    </Col>
                  </Row>
                  <Row justify="space-between" style={{ marginTop: '8px' }}>
                    <Col>Phí vận chuyển:</Col>
                    <Col style={{ fontWeight: '500' }}>0 đ</Col>
                  </Row>
                        </div>

                <Divider style={{ margin: '12px 0' }} />

                <Row justify="space-between" style={{ marginBottom: '20px' }}>
                  <Col>
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>Tổng cộng:</span>
                  </Col>
                  <Col>
                    <span style={{ color: '#ff4d4f', fontSize: '20px', fontWeight: '700' }}>
                      {cartData?.totalAmount?.toLocaleString('vi-VN')} đ
                    </span>
                  </Col>
                </Row>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{ height: '48px', fontSize: '16px' }}
                >
                  Đặt hàng ({cartData?.cartItems?.length || 0} sản phẩm)
                </Button>
              </Card>
            </Col>
          </Row>
        </Form>
      ),
    }
  ];

  return (
    <div style={styles.container}>
      <Steps
        current={currentStep}
        items={steps.map(item => ({ title: item.title }))}
        style={{ marginBottom: '24px' }}
      />
      {steps[currentStep].content}
        </div>
    );
};

const styles = {
  container: {
    padding: '24px',
    background: '#f5f5f5',
    minHeight: '100vh'
  }
};

export default CheckoutPage;
