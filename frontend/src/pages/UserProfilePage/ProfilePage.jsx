import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaPhone, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ phoneNumber: '', address: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProfile(response.data);
            setFormData({
                phoneNumber: response.data.phoneNumber || '',
                address: response.data.address || '',
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error fetching profile');
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/update/${profile.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setProfile(response.data);
            setEditMode(false);
            fetchProfile();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error updating profile');
        }
    };

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!profile) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Thông Tin Chi Tiết</h2>
            <div style={styles.info}><FaUser style={styles.icon} /><strong>Username:</strong> {profile.username}</div>
            <div style={styles.info}><FaPhone style={styles.icon} /><strong>Phone:</strong> {profile.phoneNumber}</div>
            <div style={styles.info}><FaMapMarkerAlt style={styles.icon} /><strong>Address:</strong> {profile.address}</div>

            {editMode ? (
                <div style={styles.form}>
                    <div style={styles.formGroup}>
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <button onClick={handleUpdateProfile} style={{ ...styles.button, ...styles.saveButton }}>
                        <FaSave /> Lưu
                    </button>
                </div>
            ) : (
                <button onClick={handleEdit} style={{ ...styles.button, ...styles.editButton }}>
                    <FaEdit /> Chỉnh sửa
                </button>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '50px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#007bff',
    },
    info: {
        fontSize: '20px',
        margin: '15px 0',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: '10px',
        color: '#007bff',
    },
    form: {
        marginTop: '20px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    button: {
        padding: '12px 25px',
        fontSize: '16px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    editButton: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    saveButton: {
        backgroundColor: '#28a745',
        color: 'white',
    },
    error: {
        color: 'red',
        fontSize: '18px',
        textAlign: 'center',
    },
    loading: {
        textAlign: 'center',
        fontSize: '20px',
    }
};

export default Profile;
