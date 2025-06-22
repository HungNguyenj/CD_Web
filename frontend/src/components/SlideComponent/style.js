import styled from 'styled-components';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const WrapperSlideStyle = styled(Slider)`
    .slick-dots {
        bottom: 20px;
        
        li button {
            &:before {
                font-size: 12px;
                color: white;
                opacity: 0.5;
        }
    }
        
        li.slick-active button:before {
            opacity: 1;
            color: white;
        }
    }

    .slick-prev, .slick-next {
        z-index: 1;
        width: 40px;
        height: 40px;
        
        &:before {
            font-size: 40px;
        }
    }

    .slick-prev {
        left: 20px;
    }

    .slick-next {
        right: 20px;
                }

    &:hover {
        .slick-prev, .slick-next {
            opacity: 1;
        }
    }
`;