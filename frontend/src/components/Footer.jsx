import React from 'react';
import "../styles/components/Footer.scss"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__content">
                    <p className="footer__content__contacts">
                        +7-8352-20-12-09, telegram
                    </p>
                    <p className="footer__content__copyright">
                        Мой Силант 2025
                    </p>
                </div>
            </div>

        </footer>
    );
};

export default Footer;