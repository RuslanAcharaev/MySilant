import React from 'react';
import "../styles/pages/MainPage.scss"
import {useAuthStore} from "../store/authStore.js";
import UserInfo from "../components/UserInfo.jsx";
import PublicInfo from "../components/PublicInfo.jsx";

const MainPage = () => {
    const {isAuthenticated} = useAuthStore();

    return (
        <section className="data-section">
            <div className="container">
                <div className="data-section__content">
                    {isAuthenticated ? <UserInfo/> : <PublicInfo/>}
                </div>
            </div>
        </section>
    );
};

export default MainPage;