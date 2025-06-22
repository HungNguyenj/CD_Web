import React, { useState, useEffect } from "react";
import Header from "../../components/HeaderComponent/HeaderComponent";
import "./login.css";
import Footer from "../../components/FooterComponent/Footer";
import { Link, useNavigate } from "react-router-dom";
import Login from "../../assets/images/logo_login.jpg";
import axiosInstance from "../../api/axiosConfig";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { message } from "antd";

export default function LoginPage() {
    const [username, setUserName] = useState("");
    const [password, setPassWord] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUserName(storedUsername);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
                username: username,
                password: password,
            });

            // Lưu token và thông tin người dùng
            
                localStorage.setItem('token', response.token);
                localStorage.setItem('username', username);
                localStorage.setItem('isAdmin', response.admin);
                message.success("Đăng nhập thành công!");
                // Chuyển hướng dựa vào vai trò
                if (response.admin) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            
            
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            if (error.response?.data?.code === 1006) {
                setError("Tài khoản hoặc mật khẩu không chính xác");
            } else {
                setError("Đã xảy ra lỗi, vui lòng thử lại");
            }
        }
    };

    return (
        <div>
            <div className="container-fuid bg-gray">
                <section className="container">
                    <div className="d-flex row">
                        <div className="block-left col-6">
                            <img src={Login} alt="Login" />
                        </div>
                        <div className="block-right col-6">
                            <div className="bg-white w-80">
                                <h1>Đăng nhập</h1>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <div className="mb-3 mt-3 text-just">
                                    <label htmlFor="username" className="form-label">
                                        Tên đăng nhập:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Nhập tên đăng nhập"
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 text-just">
                                    <label htmlFor="password" className="form-label">
                                        Mật khẩu:
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Nhập mật khẩu"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassWord(e.target.value)}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="rememberMe"
                                            name="rememberMe"
                                        />
                                        <label className="form-check-label">Ghi nhớ tài khoản</label>
                                    </div>
                                    <div>
                                        <Link to="/forgot-password" className="forget-pass" state={{ from: 'login' }}>
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
                                </div>
                                <div className="wrap-btn-login">
                                    <button className="btn btn-primary btn-login" onClick={handleLogin}>
                                        Đăng nhập
                                    </button>
                                </div>

                                <div className="mt-4">
                                    Chưa có tài khoản?{" "}
                                    <Link className="forget-pass" to="/register">
                                        Đăng ký ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}