import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [address, setAddress] = useState({ street: '', city: '', state: '' });
    const [error, setError] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vui lòng đăng nhập.');
            return;
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserId(decodedToken.userId);

        if (location.state && location.state.productId) {
            // Trường hợp mua ngay từ ProductDetail
            const { productId, quantity } = location.state;

            axios.get(`/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const updatedProduct = response.data;
                    const item = { id: updatedProduct.id, product: updatedProduct, quantity };
                    setCartItems([item]);

                    const priceToUse = updatedProduct.discountPrice > 0
                        ? updatedProduct.discountPrice
                        : updatedProduct.price;

                    setTotalAmount(priceToUse * quantity);
                })
                .catch(err => {
                    console.error('Lỗi load sản phẩm:', err);
                    setError('Không thể load sản phẩm.');
                });

        } else {
            // Trường hợp vào từ giỏ hàng
            const fetchCartItems = async () => {
                try {
                    const response = await axios.get('/api/cart', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCartItems(response.data);
                    const total = response.data.reduce((sum, item) => {
                        const priceToUse = item.product.discountPrice > 0
                            ? item.product.discountPrice
                            : item.product.price;
                        return sum + priceToUse * item.quantity;
                    }, 0);
                    setTotalAmount(total);
                } catch (err) {
                    console.error('Error fetching cart:', err);
                    setError('Failed to load cart');
                }
            };
            fetchCartItems();
        }
    }, [location.state]);

    const handlePayment = async () => {
        try {
            const orderItems = cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                userId: userId
            }));

            await axios.post('/api/payments/create', {
                userId: userId,
                amount: totalAmount,
                method: paymentMethod,
                address,
                orderItems
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            setOrderPlaced(true);
            setCartItems([]);
            setTotalAmount(0);
        } catch (err) {
            console.error('Error creating payment:', err);
            setError('Failed to create payment.');
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div style={{ padding: '40px 20px', background: '#f7f7f7', minHeight: '100vh' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '20px', textAlign: 'center', color: '#333' }}>Xác nhận đơn hàng</h1>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                {!orderPlaced ? (
                    <>
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#555' }}>Thông tin sản phẩm</h2>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                                    <img src={`/assets/images/${item.product.image}`} alt={item.product.name} style={{ width: '100px', height: '100px', borderRadius: '8px', marginRight: '20px' }} />
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '18px' }}>{item.product.name}</h3>
                                        {item.product.discountPrice > 0 ? (
                                            <p style={{ margin: '5px 0' }}>
                                                Giá: <span style={{ textDecoration: 'line-through', color: '#999' }}>{item.product.price} đ</span>
                                                <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '10px' }}>{item.product.discountPrice} đ</span>
                                            </p>
                                        ) : (
                                            <p style={{ margin: '5px 0' }}>Giá: {item.product.price} đ</p>
                                        )}
                                        <p style={{ margin: '5px 0' }}>Số lượng: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            <h2 style={{ fontSize: '20px', textAlign: 'right' }}>Tổng tiền: {totalAmount.toLocaleString()} đ</h2>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#555' }}>Địa chỉ giao hàng</h2>
                            <input type="text" name="street" value={address.street} onChange={handleAddressChange} placeholder="Đường" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            <input type="text" name="city" value={address.city} onChange={handleAddressChange} placeholder="Thành phố" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            <input type="text" name="state" value={address.state} onChange={handleAddressChange} placeholder="Quận/Huyện" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#555' }}>Phương thức thanh toán</h2>
                            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button onClick={handlePayment} style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                                Đặt hàng ngay
                            </button>
                            <button onClick={handleGoBack} style={{ flex: 1, padding: '12px', backgroundColor: '#007bff', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                                Tiếp tục mua hàng
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#e6ffe6', borderRadius: '8px' }}>
                        <h2 style={{ fontSize: '24px', color: '#28a745' }}>Đặt hàng thành công!</h2>
                        <p style={{ fontSize: '16px' }}>Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
