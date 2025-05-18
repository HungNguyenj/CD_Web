import React, { useState, useEffect } from "react";
import Header from "../../components/HeaderComponent/HeaderComponent";
import "./login.css";
import Footer from "../../components/FooterComponent/Footer";
import { Link, useNavigate } from "react-router-dom";

import Login from "../../assets/images/logo_login.jpg";

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
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            if (response.ok) {
                // Đăng nhập thành công
                console.log("Đăng nhập thành công");
                // Redirect hoặc thực hiện hành động sau khi đăng nhập thành công
                const data = await response.json();
                localStorage.setItem('token', data.jwt);
                localStorage.setItem('username', username);
                localStorage.setItem('isAdmin',data.admin);
                if (data.admin) {
                    navigate("/admin");
                } else {
                    navigate("/");
                    window.location.reload(); // Load lại trang
                }


            } else {
                // Đăng nhập thất bại
                setError("Đăng nhập sai tài khoản hoặc mật khẩu");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            setError("Đã xảy ra lỗi, vui lòng thử lại");
        }
    };

    return (
        <div>
            <div className="container-fuid bg-gray">
                <section className="container">
                    <div className="d-flex row">
                        <div className="block-left col-6">
                            <img src={Login} alt="Login"></img>
                        </div>
                        <div className="block-right col-6">
                            <div className="bg-white w-80">
                                <h1>Đăng nhập</h1>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <div class="mb-3 mt-3 text-just">
                                    <label for="email" class="form-label">
                                        Nhập email:
                                    </label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="email"
                                        placeholder="Email"
                                        name="email"
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </div>
                                <div class="mb-3 text-just">
                                    <label for="pwd" class="form-label">
                                        Mật khẩu:
                                    </label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        id="pwd"
                                        placeholder="Nhập mật khẩu"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassWord(e.target.value)}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div class="form-check">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            id="check1"
                                            name="option1"
                                            value="something"
                                        />
                                        <label class="form-check-label">Ghi nhớ tài khoản</label>
                                    </div>
                                    <div>
                                        <a href="frontend/src/pages/LoginPage/Login" className="forget-pass">
                                            Quên mật khẩu?
                                        </a>
                                    </div>
                                </div>
                                <div className="wrap-btn-login">
                                    <button className="btn btn-primary btn-login" onClick={handleLogin}>
                                        Đăng nhập
                                    </button>
                                </div>

                                <div className="mt-4">
                                    Chưa có tài khoản ?{" "}
                                    <Link className="forget-pass" to="/register">
                                        Đăng kí ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer></Footer>
        </div>
    );
}