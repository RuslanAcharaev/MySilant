import React, {useEffect} from 'react';
import {useInfoStore} from '../store/infoStore.js'
import GeneralTable from "./Tables/GeneralTable.jsx";
import "../styles/components/General.scss"
import ClockIcon from "./ClockIcon.jsx";

const General = () => {
    const {
        getGeneralInfo,
        generalInfoLoading,
        generalInfo,
        generalInfoError,
        getReferenceBooks,
        getServiceOrganizations,
        referenceBooks,
        serviceOrganizations
    } = useInfoStore();

    useEffect(() => {
        if (!generalInfo) {
            getGeneralInfo();
        }
        if (!referenceBooks) {
            getReferenceBooks();
        }
        if (!serviceOrganizations) {
            getServiceOrganizations();
        }
    }, []);

    if (generalInfoLoading) {
        return (
            <div className="general-loading">
                <ClockIcon/>
                <p className="loading-text">Загрузка данных...</p>
            </div>
        );
    }

    if (generalInfoError) {
        return (
            <div className="general-loading">
                <p className="notification-text">
                    Произошла ошибка при загрузке данных: {generalInfoError.message}
                </p>
            </div>);
    }

    if (!generalInfo) {
        return (
            <div className="general-loading">
                <p className="notification-text">
                    Нет доступных данных
                </p>
            </div>);
    }

    return (
        <div className="general-information">
            <GeneralTable/>
        </div>
    );
};

export default General;