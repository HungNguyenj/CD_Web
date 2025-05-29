import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    const {
        size, placeholder, textButton,
        bordered, backgroundColorInput = '#fff',
        backgroundColorButton = 'rgb(13, 92, 182)',
        colorButton = '#fff',
        onSearch, // Thêm prop onSearch
        value, // Thêm prop value
        setValue // Thêm prop setValue
    } = props

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSearch(event);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <InputComponent
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{ backgroundColor: backgroundColorInput }}
                value={value} // Gán giá trị cho input
                onChange={(e) => setValue(e.target.value)} // Cập nhật giá trị khi thay đổi
                onKeyPress={handleKeyPress} // Gọi onSearch khi nhấn Enter
            />
            <ButtonComponent
                size={size}
                styleButton={{ background: backgroundColorButton, border: !bordered && 'none' }}
                icon={<SearchOutlined color={colorButton} style={{ color: '#fff' }} />}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
                onClick={onSearch} // Gọi onSearch khi nhấn nút
            />
        </div>
    )
}

export default ButtonInputSearch
