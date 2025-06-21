import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./register.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Footer from "../../components/FooterComponent/Footer";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { message } from "antd";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        address: "",
        email: ""
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        // Validate username
        if (!formData.username) {
            newErrors.username = "Vui lòng nhập tên đăng nhập";
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
        } else if (formData.password.length < 8) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        }

        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Vui lòng nhập email";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        // Validate phone number
        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại không hợp lệ";
        }

        // Validate address
        if (!formData.address) {
            newErrors.address = "Vui lòng nhập địa chỉ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axiosInstance.post(API_ENDPOINTS.USERS, {
                username: formData.username,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                email: formData.email
            });

            message.success("Đăng ký thành công!");
            navigate("/login");
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            if (error.response?.data?.code === 1002) {
                setErrors(prev => ({
                    ...prev,
                    username: "Tên đăng nhập đã tồn tại"
                }));
            } else if (error.response?.data?.code === 1004) {
                setErrors(prev => ({
                    ...prev,
                    password: "Mật khẩu phải có ít nhất 8 ký tự"
                }));
            } else if (error.response?.data?.code === 1009) {
                setErrors(prev => ({
                    ...prev,
                    email: "Email không hợp lệ"
                }));
            } else {
                message.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
            }
        }
    };

    return (
        <div>
            <div className="container-fluid bg-gray">
                <section className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="bg-white register-form">
                                <h1 className="text-center">Đăng ký tài khoản</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                                                <input
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                            </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                                                <input
                                            type="password"
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                            </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                                <input
                                                    type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                                    name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                            </div>

                                    <div className="mb-3">
                                        <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                                                <input
                                            type="tel"
                                            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                        />
                                        {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                                            </div>

                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Địa chỉ</label>
                                                <input
                                            type="text"
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                        />
                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                            </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            Đăng ký
                                                    </button>
                                                </div>

                                    <div className="mt-3 text-center">
                                        Đã có tài khoản?{" "}
                                        <Link to="/login" className="text-primary">
                                            Đăng nhập ngay
                                                    </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                </div>
            <Footer />
        </div>
    );
}