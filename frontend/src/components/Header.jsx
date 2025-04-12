import React, {useState} from 'react';
import '../styles/components/Header.scss';
import Logo from '../assets/images/Header/Logotype-accent-RGB.svg?react';
import AltLogo from '../assets/images/Header/AltLogotype.svg?react';
import LoginForm from "./LoginForm.jsx";
import {useAuthStore} from "../store/authStore.js";
import HeaderProfile from "./HeaderProfile.jsx";

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        isAuthenticated,
        showLoginModal,
        setShowLoginModal
    } = useAuthStore();

    const handleModalClose = () => {
        setShowLoginModal(false);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header__content">
                    <div className="header__content__top">
                        <Logo className="header__content__logo"/>
                        <AltLogo className="header__content__alt-logo"/>
                        <div className="header__content__contacts">
                            <p className="number">+7-8352-20-12-09</p>
                            <a href="#" className="telegram-link">telegram</a>
                        </div>
                        {isAuthenticated ? <HeaderProfile/> : (
                            <button className="header__content__btn" onClick={
                                () => setShowLoginModal(true)
                            }>Войти
                            </button>
                        )}
                    </div>
                    <div className="header__content__bottom">
                        <h2 className="header__content__title">Электронная сервисная книжка "Мой Силант"</h2>
                    </div>
                    {showLoginModal && (<LoginForm handleModalClose={handleModalClose}/>)}
                </div>
            </div>
        </header>
    );
};

export default Header;