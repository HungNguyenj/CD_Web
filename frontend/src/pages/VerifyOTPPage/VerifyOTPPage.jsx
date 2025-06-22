import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import './verifyOTP.css';

const VerifyOTPPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        navigate('/forgot-password');
        return null;
    }

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(
                `${API_ENDPOINTS.VERIFY_OTP}?email=${email}&otp=${values.otp}`
            );
            
            if (response) {
                message.success('Xác thực OTP thành công!');
                navigate('/reset-password', { state: { email } });
            }
        } catch (error) {
            message.error(error.message || 'Mã OTP không hợp lệ. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
                email: email
            });
            message.success('Mã OTP mới đã được gửi đến email của bạn!');
        } catch (error) {
            message.error('Không thể gửi lại mã OTP. Vui lòng thử lại sau!');
        }
    };

    return (
        <div className="verify-otp-container">
            <div className="verify-otp-card">
                <h2>Xác thực OTP</h2>
                <p>Nhập mã OTP đã được gửi đến email của bạn</p>
                <Form
                    name="verify-otp"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="otp"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã OTP!' },
                            { len: 6, message: 'Mã OTP phải có 6 chữ số!' }
                        ]}
                    >
                        <Input 
                            prefix={<KeyOutlined />}
                            placeholder="Nhập mã OTP" 
                            size="large"
                            maxLength={6}
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
                            Xác nhận
                        </Button>
                    </Form.Item>

                    <div className="text-center">
                        <Button type="link" onClick={handleResendOTP}>
                            Gửi lại mã OTP
                        </Button>
                        <br />
                        <Button type="link" onClick={() => navigate('/forgot-password')}>
                            Quay lại
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default VerifyOTPPage; 