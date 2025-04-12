import React, {useEffect} from 'react';
import {useInfoStore} from '../store/infoStore.js';
import ComplaintsTable from "./Tables/ComplaintsTable.jsx";
import "../styles/components/Complaints.scss"
import ClockIcon from "./ClockIcon.jsx";

const Complaints = () => {
    const {
        getComplaintsInfo,
        complaintsInfo,
        complaintsInfoError,
        complaintsInfoLoading
    } = useInfoStore();

    useEffect(() => {
        if (!complaintsInfo) {
            getComplaintsInfo();
        }
    }, []);

    if (complaintsInfoLoading) {
        return (
            <div className="complaints-loading">
                <ClockIcon/>
                <p className="loading-text">Загрузка данных...</p>
            </div>
        );
    }

    if (complaintsInfoError) {
        return (
            <div className="complaints-loading">
                <p className="notification-text">
                    Произошла ошибка при загрузке данных: {complaintsInfoError.message}
                </p>
            </div>);
    }

    if (!complaintsInfo) {
        return (
            <div className="complaints-loading">
                <p className="notification-text">
                    Нет доступных данных
                </p>
            </div>);
    }
    return (
        <div className="complaints-information">
            <ComplaintsTable/>
        </div>
    );
};

export default Complaints;