import React from 'react';
import "../styles/components/HeaderProfile.scss";
import {useAuthStore} from "../store/authStore.js";

const HeaderProfile = () => {
    const {
        logout,
    } = useAuthStore();

    const handleLogout = async () => {
        await logout();
    }

    return (
        <div className="profile-container">
            <button className="logout-btn" onClick={handleLogout}>Выйти</button>
        </div>
    );
};

export default HeaderProfile;