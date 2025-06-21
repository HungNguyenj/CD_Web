import React from 'react';
import { Image } from 'antd';
import { WrapperSlideStyle } from './style';
import slide1 from '../../assets/images/slide1.jpg';
import slide2 from '../../assets/images/slide2.jpg';
import slide3 from '../../assets/images/slide3.jpg';

const SlideComponent = () => {
    const slides = [
        {
            id: 1,
            image: slide1,
            title: 'Sách hay mỗi ngày'
        },
        {
            id: 2,
            image: slide2,
            title: 'Khuyến mãi đặc biệt'
        },
        {
            id: 3,
            image: slide3,
            title: 'Sách mới về'
        }
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    return (
        <WrapperSlideStyle {...settings}>
            {slides.map((slide) => (
                <div key={slide.id}>
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        preview={false}
                        style={{
                            width: '100%',
                            height: '400px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                    />
                </div>
            ))}
        </WrapperSlideStyle>
    );
};

export default SlideComponent;