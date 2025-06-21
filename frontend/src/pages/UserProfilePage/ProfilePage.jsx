import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaEnvelope } from 'react-icons/fa';
import axiosInstance from '../../api/axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { message } from 'antd';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        address: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const profileData = await axiosInstance.get(API_ENDPOINTS.USER_PROFILE);
            console.log('Profile response:', profileData); // Để debug

            if (profileData) {
                setProfile(profileData);
                setFormData({
                    phoneNumber: profileData.phoneNumber || '',
                    address: profileData.address || '',
                    email: profileData.email || ''
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            message.error('Không thể tải thông tin cá nhân. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (formData.phoneNumber && !/^[0-9]{10}$/.test(formData.phoneNumber)) {
            message.error('Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.');
            return false;
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            message.error('Email không hợp lệ.');
            return false;
        }
        return true;
    };

    const handleUpdateProfile = async () => {
        if (!validateForm()) return;

        try {
            const updatedData = await axiosInstance.put(
                API_ENDPOINTS.USER_BY_ID(profile.id),
                formData
            );
            
            if (updatedData) {
                setProfile(updatedData);
                setEditMode(false);
                message.success('Cập nhật thông tin thành công!');
                await fetchProfile(); // Refresh data
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            const errorMessage = err.response?.data?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại sau.';
            message.error(errorMessage);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Đang tải thông tin...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Thông Tin Cá Nhân</h2>
            
            <div style={styles.infoContainer}>
                <div style={styles.info}>
                    <FaUser style={styles.icon} />
                    <div style={styles.infoContent}>
                        <strong>Tên đăng nhập:</strong>
                        <span>{profile?.username || 'Chưa cập nhật'}</span>
                    </div>
                </div>

                <div style={styles.info}>
                    <FaEnvelope style={styles.icon} />
                    <div style={styles.infoContent}>
                        <strong>Email:</strong>
                        {editMode ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Nhập email của bạn"
                            />
                        ) : (
                            <span>{profile?.email || 'Chưa cập nhật'}</span>
                        )}
                    </div>
                </div>

                <div style={styles.info}>
                    <FaPhone style={styles.icon} />
                    <div style={styles.infoContent}>
                        <strong>Số điện thoại:</strong>
                        {editMode ? (
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Nhập số điện thoại"
                            />
                        ) : (
                            <span>{profile?.phoneNumber || 'Chưa cập nhật'}</span>
                        )}
                    </div>
                </div>

                <div style={styles.info}>
                    <FaMapMarkerAlt style={styles.icon} />
                    <div style={styles.infoContent}>
                        <strong>Địa chỉ:</strong>
                        {editMode ? (
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Nhập địa chỉ của bạn"
                            />
                        ) : (
                            <span>{profile?.address || 'Chưa cập nhật'}</span>
                        )}
                    </div>
                </div>
            </div>

            <div style={styles.buttonContainer}>
                {editMode ? (
                    <button onClick={handleUpdateProfile} style={{ ...styles.button, ...styles.saveButton }}>
                        <FaSave /> Lưu thay đổi
                    </button>
                ) : (
                    <button onClick={handleEdit} style={{ ...styles.button, ...styles.editButton }}>
                        <FaEdit /> Chỉnh sửa
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '50px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#1890ff',
    },
    infoContainer: {
        marginBottom: '30px',
    },
    info: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
    },
    icon: {
        fontSize: '24px',
        marginRight: '15px',
        color: '#1890ff',
    },
    infoContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    input: {
        padding: '8px 12px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        fontSize: '14px',
        width: '100%',
        marginTop: '5px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    editButton: {
        backgroundColor: '#1890ff',
        color: 'white',
        '&:hover': {
            backgroundColor: '#40a9ff',
        },
    },
    saveButton: {
        backgroundColor: '#52c41a',
        color: 'white',
        '&:hover': {
            backgroundColor: '#73d13d',
        },
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
        color: '#666',
    },
};

export default Profile;
