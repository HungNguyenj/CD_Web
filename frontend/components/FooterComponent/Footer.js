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

export default function Footer() {
return (
    <footer className="footer-section">
        <div className="container">
            <div className="footer-cta pt-5 pb-5">
                <div className="row">
                    <div className="col-xl-4 col-md-4 mb-30">
                        <div className="single-cta">
                            <i className="fas fa-map-marker-alt"></i>
                            <div className="cta-text">
                                <h4>Địa chỉ</h4>
                                <span>khu phố 6,Linh Trung,Thủ Đức</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-4 mb-30">
                        <div className="single-cta">
                            <i className="fas fa-phone"></i>
                            <div className="cta-text">
                                <h4>Liên hệ</h4>
                                <span>0329463114</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-4 mb-30">
                        <div className="single-cta">
                            <i className="far fa-envelope-open"></i>
                            <div className="cta-text">
                                <h4>Mail</h4>
                                <span>BookStore@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-content pt-5 pb-5">
                <div className="row">
                    <div className="col-xl-4 col-lg-4 mb-50">
                        <div className="footer-widget">
                            <div className="footer-logo">
                                <a href="index.html"><img src={Logo}  className="img-fluid" alt="logo" />
                                </a>
                            </div>
                            <div className="footer-text">
                                <p>BookStore nhận đặt hàng trực tuyến và giao hàng tận nơi.
                                    KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống Fahasa trên toàn quốc.</p>
                            </div>
                            <div className="footer-social-icon">
                                <span>Theo dõi chúng tôi</span>
                                <FaFacebook className="fab fa-facebook-f facebook-bg"/>
                                <AiFillTwitterCircle className="fab fa-twitter twitter-bg"/>
                                <ImGoogle3 className="fab fa-google-plus-g google-bg"/>

                                {/*<a href="#"><i className="fab fa-google-plus-g google-bg"></i></a>*/}
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
                        <div className="footer-widget">
                            <div className="footer-widget-heading">
                                <h3>Dịch vụ</h3>
                            </div>
                            <ul >
                                <img src={Ahamove}/>
                                <img src={Snappy}/>
                                <img src={Nija}/>
                                <img src={Momo}/>
                                <img src={Zalopay}/>
                                <img src={VnPay}/>

                            </ul>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
                        <div className="footer-widget">
                            <div className="footer-widget-heading">
                                <h3>Hỗ Trợ</h3>
                            </div>
                            <div className="footer-text mb-25">
                                <p> Chính sách đổi - trả - hoàn tiền</p>
                                <p> Chính sách bảo hành - bồi hoàn</p>
                                <p> Chính sách vận chuyển</p>
                                <p> Chính sách khách sỉ</p>
                                <p> Phương thức thanh toán và xuất HĐ</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="copyright-area">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 text-center text-lg-left">
                        <div className="copyright-text">
                            <p>Copyright &copy; 2044, BookStore
                                </p>
                        </div>
                    </div>
                    {/*<div className="col-xl-6 col-lg-6 d-none d-lg-block text-right">*/}
                    {/*    <div className="footer-menu">*/}
                    {/*        <ul>*/}
                    {/*            <li><a href="#">Home</a></li>*/}
                    {/*            <li><a href="#">Terms</a></li>*/}
                    {/*            <li><a href="#">Privacy</a></li>*/}
                    {/*            <li><a href="#">Policy</a></li>*/}
                    {/*            <li><a href="#">Contact</a></li>*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    </footer>
);
}