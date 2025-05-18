import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaPhone, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false); // Trạng thái để kiểm soát việc hiển thị form chỉnh sửa
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProfile(response.data);
            setPhoneNumber(response.data.phoneNumber);
            setAddress(response.data.address);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        fetch(`http://localhost:8080/update/${profile.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ phoneNumber, address }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Profile updated successfully:');
                }
                return response.json();
            })
            .then(data => {
                console.log('Profile updated successfully:', data);
                setProfile(data); // Cập nhật lại thông tin profile trong state
                setEditMode(false); // Thoát chế độ chỉnh sửa
                fetchProfile(); // Reload lại thông tin profile
            })
            .catch(error => {
                console.error('Profile updated successfully:', error);
                // Xử lý lỗi khi cập nhật không thành công
                setError('Profile updated successfully:');
                window.location.reload(); // Load lại trang
            });
    };

    const handleEdit = () => {
        setEditMode(true); // Khi nhấn chỉnh sửa, hiển thị form chỉnh sửa
    };

    const handleChangePhoneNumber = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleChangeAddress = (event) => {
        setAddress(event.target.value);
    };

    if (error) {
        return <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>{error}</div>;
    }

    if (!profile) {
        return <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Profile</h2>
            <div style={styles.info}>
                <FaUser style={styles.icon} />
                <p><strong>Username:</strong> {profile.username}</p>
            </div>
            <div style={styles.info}>
                <FaPhone style={styles.icon} />
                <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
            </div>
            <div style={styles.info}>
                <FaMapMarkerAlt style={styles.icon} />
                <p><strong>Address:</strong> {profile.address}</p>
            </div>

            {editMode ? (
                <form style={styles.form}>
                    <label style={styles.label}>
                        Phone Number:
                        <input type="text" value={phoneNumber} onChange={handleChangePhoneNumber} style={styles.input} />
                    </label>
                    <br />
                    <label style={styles.label}>
                        Address:
                        <input type="text" value={address} onChange={handleChangeAddress} style={styles.input} />
                    </label>
                    <br />
                    <button type="button" onClick={handleUpdateProfile} style={{ ...styles.button, ...styles.saveButton }}>
                        <FaSave style={styles.iconButton} /> Save
                    </button>
                </form>
            ) : (
                <button onClick={handleEdit} style={{ ...styles.button, ...styles.editButton }}>
                    <FaEdit style={styles.iconButton} /> Edit Profile
                </button>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: 'auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        fontFamily: "'Arial', sans-serif",
        textAlign: 'center',
        transition: 'transform 0.3s',
    },
    title: {
        fontSize: '26px',
        marginBottom: '20px',
        color: '#333',
        fontWeight: 'bold',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
    },
    info: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '15px',
    },
    icon: {
        marginRight: '10px',
        color: '#007bff',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontSize: '18px',
        color: '#555',
    },
    input: {
        width: 'calc(100% - 20px)',
        padding: '10px',
        marginTop: '5px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    button: {
        display: 'inline-block',
        padding: '12px 25px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.3s',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    saveButton: {
        backgroundColor: '#28a745',
        color: 'white',
    },
    editButton: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    iconButton: {
        marginRight: '5px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    }
};

export default Profile;
