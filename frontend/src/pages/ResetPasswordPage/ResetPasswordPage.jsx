import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import './resetPassword.css';

const ResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        navigate('/forgot-password');
        return null;
    }

    const onFinish = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, {
                email: email,
                newPassword: values.newPassword
            });
            
            message.success('Đặt lại mật khẩu thành công!');
            navigate('/login');
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <h2>Đặt lại mật khẩu</h2>
                <p>Nhập mật khẩu mới của bạn</p>
                <Form
                    name="reset-password"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu mới"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Xác nhận mật khẩu"
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
                            Đặt lại mật khẩu
                        </Button>
                    </Form.Item>

                    <div className="text-center">
                        <Button type="link" onClick={() => navigate('/verify-otp', { state: { email } })}>
                            Quay lại
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ResetPasswordPage; 