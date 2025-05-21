import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: ''
    });
    const [error, setError] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false); // State để kiểm soát việc hiển thị nội dung thành công
    const [userId, setUserId] = useState(null); // Thêm state để lưu trữ user ID
    const navigate = useNavigate(); // Lấy hàm navigate từ react-router-dom

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCartItems(response.data);
                const total = response.data.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
                setTotalAmount(total);

                // Lấy user ID từ token
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUserId(decodedToken.userId);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError('Failed to fetch cart items.');
            }
        };

        fetchCartItems();
    }, []);

    const handlePayment = async () => {
        try {
            const orderItems = cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                userId: userId // Sử dụng user ID từ state
            }));

            const response = await axios.post('/api/payments/create', {
                userId: userId, // Thêm userId vào body request
                amount: totalAmount,
                method: paymentMethod,
                address,
                orderItems,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Payment created:', response.data);
            setOrderPlaced(true); // Đánh dấu đơn hàng đã được đặt thành công

            // Clear cart
            setCartItems([]); // Cập nhật trạng thái giỏ hàng để xóa tất cả các mặt hàng
            setTotalAmount(0); // Đặt lại tổng số tiền
            localStorage.removeItem('cartItems'); // Xóa giỏ hàng từ localStorage
        } catch (error) {
            console.error('Error creating payment:', error);
            setError('Failed to create payment.');
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value
        });
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Checkout</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!orderPlaced ? (
                <>
                    <h2 style={{ textAlign: 'center', color: '#333' }}>Sản Phẩm</h2>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        {cartItems.map(item => (
                            <li key={item.id} style={{ backgroundColor: '#fff', marginBottom: '10px', padding: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd' }}>
                                <span>{item.product.name}</span>
                                <span>{item.quantity} x {item.product.price}₫</span>
                            </li>
                        ))}
                    </ul>
                    <h2 style={{ textAlign: 'center', color: '#333' }}>Tổng tiền: {totalAmount.toFixed(2)}₫</h2>
                    <h2 style={{ textAlign: 'center', color: '#333' }}>Địa chỉ giao hàng</h2>
                    <form style={{ marginTop: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Đường:</label>
                        <input type="text" name="street" value={address.street} onChange={handleAddressChange} required style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <br />
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Thành phố:</label>
                        <input type="text" name="city" value={address.city} onChange={handleAddressChange} required style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <br />
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Huyện:</label>
                        <input type="text" name="state" value={address.state} onChange={handleAddressChange} required style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </form>
                    <h2 style={{ textAlign: 'center', color: '#333' }}>Chọn Phương thức thanh toán</h2>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <option value="COD">Cash on Delivery</option>
                    </select>
                    <button onClick={handlePayment} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Đặt hàng</button>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
                    <h2>Thanh toán thành công!</h2>
                    <p>Xin cảm ơn đã mua hàng của chúng tôi.</p>
                </div>
            )}
        </div>
    );
};

export default Checkout;
