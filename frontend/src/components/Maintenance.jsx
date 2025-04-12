import React, {useEffect} from 'react';
import {useInfoStore} from '../store/infoStore.js';
import "../styles/components/Maintenance.scss";
import MaintenanceTable from "./Tables/MaintenanceTable.jsx";
import ClockIcon from "./ClockIcon.jsx";

const Maintenance = () => {
    const {
        getMaintenanceInfo,
        maintenanceInfo,
        maintenanceInfoLoading,
        maintenanceInfoError
    } = useInfoStore();

    useEffect(() => {
        if (!maintenanceInfo) {
            getMaintenanceInfo();
        }
    }, []);

    if (maintenanceInfoLoading) {
        return (
            <div className="maintenance-loading">
                <ClockIcon/>
                <p className="loading-text">Загрузка данных...</p>
            </div>
        );
    }

    if (maintenanceInfoError) {
        return (
            <div className="maintenance-loading">
                <p className="notification-text">
                    Произошла ошибка при загрузке данных: {maintenanceInfoError.message}
                </p>
            </div>);
    }

    if (!maintenanceInfo) {
        return (
            <div className="maintenance-loading">
                <p className="notification-text">
                    Нет доступных данных
                </p>
            </div>);
    }

    return (
        <div className="maintenance-information">
            <MaintenanceTable/>
        </div>
    );
};

export default Maintenance;