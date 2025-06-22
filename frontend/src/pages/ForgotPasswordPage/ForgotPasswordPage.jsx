import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import './forgotPassword.css';

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
                email: values.email
            });
            message.success('Mã OTP đã được gửi đến email của bạn!');
            navigate('/verify-otp', { state: { email: values.email } });
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h2>Quên mật khẩu</h2>
                <p>Nhập email của bạn để nhận mã OTP</p>
                <Form
                    name="forgot-password"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined />} 
                            placeholder="Email" 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            block
                            size="large"
                        >
                            Gửi mã OTP
                        </Button>
                    </Form.Item>

                    <div className="text-center">
                        <Button type="link" onClick={() => navigate('/login')}>
                            Quay lại đăng nhập
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage; 