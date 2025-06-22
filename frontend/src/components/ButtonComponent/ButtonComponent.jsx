import React from 'react';
import { Button } from 'antd'; // ✅ phải có

const ButtonComponent = ({
                             size,
                             styleButton = {},
                             styleTextButton = {},
                             textButton,
                             disabled,
                             ...rests
                         }) => {
    const buttonStyle = {
        ...styleButton,
        background: disabled ? '#ccc' : (styleButton?.background || '#9255FD'),
    };

    return (
        <Button
            style={buttonStyle}
            size={size}
            disabled={disabled}
            {...rests}
        >
            <span style={styleTextButton}>{textButton}</span>
        </Button>
    );
};

export default ButtonComponent;
