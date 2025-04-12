import React, {useState} from 'react';
import {useAuthStore} from "../store/authStore.js";
import "../styles/components/UserInfo.scss";
import General from "./General.jsx";
import Maintenance from "./Maintenance.jsx";
import Complaints from "./Complaints.jsx";
import GeneralIcon from "../assets/images/MainPage/docs-icon.svg?react";
import MaintenanceIcon from "../assets/images/MainPage/maintenance-icon.svg?react";
import ComplaintsIcon from "../assets/images/MainPage/complaints-icon.svg?react";
import ReferenceBooks from "./ReferenceBooks.jsx";

const UserInfo = () => {

    const {
        role,
        fullname
    } = useAuthStore();
    const [activeTab, setActiveTab] = useState('general');
    const [isReferenceBooksOpen, setReferenceBooksOpen] = useState(false);

    const handleClick = () => {
        setReferenceBooksOpen(true);
    }

    const roleDescription = (role) => {
        if (role === "CL") {
            return 'Клиент'
        } else if (role === "SO") {
            return 'Сервисная организация'
        } else if (role === "MA") {
            return 'Менеджер'
        }

    }

    const getTitle = () => {
        switch (activeTab) {
            case 'general':
                return 'Информация о комплектации и технических характеристиках Вашей техники';
            case 'maintenance':
                return 'Информация о проведенных ТО Вашей техники';
            case 'complaints':
                return 'Информация о рекламациях на Вашу технику';
            default:
                return 'Информация о комплектации и технических характеристиках Вашей техники';
        }
    }

    const tabs = [
        {id: 'general', label: 'Общая информация', icon: <GeneralIcon className="tab-icon"/>},
        {id: 'maintenance', label: 'ТО', icon: <MaintenanceIcon className="tab-icon" />},
        {id: 'complaints', label: 'Рекламации', icon: <ComplaintsIcon className="tab-icon" />},
    ]

    return (
        <div className="user-info">
            <div className="user-info__username">
                <p className="description">Вы авторизованы как:</p>
                <p className="user-data">{roleDescription(role)} - {fullname}</p>
            </div>
            <h1 className="user-info__title">{getTitle()}</h1>
            <div className="user-info__wrapper">
                <div className="user-info__tabs">
                    <nav className="user-info__tabs-nav">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`user-info__tabs-btn ${tab.id === activeTab
                                    ? 'user-info__tabs-btn--active'
                                    : 'user-info__tabs-btn--inactive'
                                }`}
                            >
                                {tab.icon}{tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="user-info__content">
                    <button
                        onClick={handleClick}
                        className="user-info__content reference-btn"
                    >
                        Справочники
                    </button>
                    <div className={`user-info__content-section ${
                        activeTab === 'general' ? 'user-info__content-section--active' : ''
                    }`}>
                        <General/>
                    </div>
                    <div className={`user-info__content-section ${
                        activeTab === 'maintenance' ? 'user-info__content-section--active' : ''
                    }`}>
                        <Maintenance/>
                    </div>
                    <div className={`user-info__content-section ${
                        activeTab === 'complaints' ? 'user-info__content-section--active' : ''
                    }`}>
                        <Complaints/>
                    </div>
                    <ReferenceBooks
                        isOpen={isReferenceBooksOpen}
                        onClose={() => setReferenceBooksOpen(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserInfo;