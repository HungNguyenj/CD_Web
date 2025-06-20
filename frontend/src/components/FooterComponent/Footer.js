import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./footer.css";
import Logo from '../../assets/images/logo_foot.png';
import { FaFacebook } from "react-icons/fa6";
import { AiFillTwitterCircle } from "react-icons/ai";
import { ImGoogle3 } from "react-icons/im";
import Ahamove from '../../assets/images/logo_ahamove.png';
import Snappy from '../../assets/images/logo_snappy.jpg';
import Momo from '../../assets/images/logo_momo.png';
import Nija from '../../assets/images/logo_nịnavan.png';
import VnPay from '../../assets/images/logo_vnpay.png';
import Zalopay from '../../assets/images/logo_zalopay.png';
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-cta pt-4 pb-4">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="single-cta">
                                <i className="fas fa-map-marker-alt"></i>
                                <div className="cta-text">
                                    <h4>Địa chỉ</h4>
                                    <span>Khu phố 6, Linh Trung, Thủ Đức</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="single-cta">
                                <i className="fas fa-phone"></i>
                                <div className="cta-text">
                                    <h4>Liên hệ</h4>
                                    <span>0329 463 114</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="single-cta">
                                <i className="far fa-envelope-open"></i>
                                <div className="cta-text">
                                    <h4>Email</h4>
                                    <span>BookStore@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-content py-4">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="footer-widget">
                                <div className="footer-logo mb-3">
                                    <img src={Logo} className="img-fluid" alt="logo" />
                                </div>
                                <div className="footer-text">
                                    <p>BookStore nhận đặt hàng trực tuyến và giao hàng tận nơi. KHÔNG hỗ trợ đặt mua trực tiếp tại văn phòng hoặc các hệ thống.</p>
                                </div>
                                <div className="footer-social-icon">
                                    <span>Theo dõi chúng tôi</span>
                                    <FaFacebook className="fab facebook-bg" />
                                    <AiFillTwitterCircle className="fab twitter-bg" />
                                    <ImGoogle3 className="fab google-bg" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="footer-widget">
                                <div className="footer-widget-heading">
                                    <h3>Dịch vụ đối tác</h3>
                                </div>
                                <div className="row g-2">
                                    <div className="col-4"><img src={Ahamove} width="100%" /></div>
                                    <div className="col-4"><img src={Snappy} width="100%" /></div>
                                    <div className="col-4"><img src={Nija} width="100%" /></div>
                                    <div className="col-4"><img src={Momo} width="100%" /></div>
                                    <div className="col-4"><img src={Zalopay} width="100%" /></div>
                                    <div className="col-4"><img src={VnPay} width="100%" /></div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="footer-widget">
                                <div className="footer-widget-heading">
                                    <h3>Trang chính</h3>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li><Link to="/">Trang chủ</Link></li>
                                    <li><Link to="/product">Sản phẩm</Link></li>
                                    <li><Link to="/cart">Giỏ hàng</Link></li>
                                    <li><Link to="/checkout">Thanh toán</Link></li>
                                    <li><Link to="/profile">Tài khoản</Link></li>
                                    <li><Link to="/contact">Liên hệ</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="copyright-area py-3 text-center">
                <p style={{ color: '#aaa', margin: 0 }}>Copyright &copy; 2024 - BookStore. All rights reserved.</p>
            </div>
        </footer>
    );
}
