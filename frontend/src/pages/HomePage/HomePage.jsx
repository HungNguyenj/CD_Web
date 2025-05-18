import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import Footer from "../../components/FooterComponent/Footer";
import { WrapperButtonMore, WrapperTypeProduct } from "./style";
import slide1 from '../../assets/images/slide1.jpg'
import slide2 from '../../assets/images/slide2.jpg'
import slide3 from '../../assets/images/slide3.jpg'
import SlideComponent from "../../components/SlideComponent/SlideComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Link } from "react-router-dom";


const HomePage = () => {

    const [categories, setCategories] = useState([]);
    const [products, setProduct] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(12);

    useEffect(() => {
        fetch("/home") // Gửi yêu cầu tới endpoint trong Spring Boot
            .then((response) => response.json()) // Chuyển đổi phản hồi thành JSON
            .then((data) => {
                setProduct(data.products); // Cập nhật state với dữ liệu loại sản phẩm
                setCategories(data.categories);
            })
            .catch((error) => console.error("Có lỗi xảy ra:", error)); // Xử lý lỗi nếu có     
    }, []); // Chạy hiệu ứng chỉ một lần khi component được gắn vào

    const loadMoreProducts = () => {
        setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 12);
    };

    return (
        <>
            <div style={{ padding: '0 120px' }}>
                <WrapperTypeProduct>
                    {categories && categories.length > 0 ? ( // Kiểm tra trước khi gọi map
                        categories.map((categories) => (
                            <Link style={{ textDecoration: 'none', color: 'black' }} key={categories.id} to={`/category/${categories.id}`}>
                                <TypeProduct name={categories.name} />
                            </Link>

                        ))
                    ) : (
                        <p>Không có loại sản phẩm nào được tìm thấy.</p> // Thông báo khi không có dữ liệu
                    )}

                </WrapperTypeProduct>
            </div>
            <div id="container" style={{ backgroundColor: '#efefef', padding: '0 120px', height: 'auto', width: '100%' }}>
                <SlideComponent arrImages={[slide1, slide2, slide3]} />
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                    {products.slice(0, visibleProducts).map((product) => (
                        <CardComponent key={product.id} product={product} />
                    ))}
                </div>
                {visibleProducts < products.length && (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <WrapperButtonMore
                            textButton="Xem thêm"
                            type="outline"
                            styleButton={{
                                border: '1px solid rgb(11,116,229)', color: 'rgb(11,116,229)',
                                width: '240px', height: '38px', borderRadius: '4px'
                            }}
                            styleTextButton={{ fontWeight: 500 }}
                            onClick={loadMoreProducts}
                        />
                    </div>
                )}
            </div>
        </>

    )
}

export default HomePage