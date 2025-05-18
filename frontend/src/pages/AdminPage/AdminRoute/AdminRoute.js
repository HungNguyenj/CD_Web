// AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ element }) => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    return isAdmin ? (
        // Trả về phần tử nội dung nếu là admin
        element
    ) : (
        // Nếu không phải admin, điều hướng đến trang /login
        <Navigate to="/login" />
    );
};

export default AdminRoute;
