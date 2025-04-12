import React, {useState} from 'react';
import {LuX} from "react-icons/lu";
import MaintenanceIcon from "../../assets/images/MainPage/maintenance-icon.svg?react";
import DocsIcon from "../../assets/images/MainPage/docs-icon.svg?react";
import ServiceIcon from "../../assets/images/MainPage/service-icon.svg?react";
import MaintenanceForm from "../Forms/MaintenanceForm.jsx";
import {useInfoStore} from "../../store/infoStore.js";
import {infoService} from "../../service/infoService.js";


const MaintenanceDetailed = ({isOpen, onClose, data}) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {
        deleteMaintenance,
    } = useInfoStore();

    if (!isOpen) return null;

    const editMaintenance = () => {
        setShowEditForm(true);
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const confirmed = window.confirm('Вы уверены, что хотите удалить эту запись?');
            if (confirmed) {
                const success = await infoService.deleteMaintenance(data.id);
                if (success) {
                    deleteMaintenance(data.id);
                    onClose();
                }
            }
        } catch (error) {
            window.alert('Ошибка при удалении')
            console.error(error)
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            {!showEditForm ? (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2 className="modal-header__title">
                                Информация о ТО машины с зав.№ {data.vehicle.number}
                            </h2>
                            <button
                                onClick={onClose}
                                className="modal-header__close-btn"
                            >
                                <LuX/>
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="modal-content__grid">
                                {[
                                    {
                                        icon: <MaintenanceIcon className="modal-content__item-icon"/>,
                                        label: "Тех. обслуживание",
                                        number: `Вид: ${data.maintenance_type?.name}`,
                                        value: `Дата: ${data.maintenance_date}`,
                                        description: data.maintenance_type?.description,
                                    },
                                    {
                                        icon: <DocsIcon className="modal-content__item-icon"/>,
                                        label: "Заказ-наряд",
                                        number: `№ ${data.work_order_number}`,
                                        value: `Дата: ${data.work_order_date}`,
                                        description: ``,
                                    },
                                    {
                                        icon: <ServiceIcon className="modal-content__item-icon"/>,
                                        label: "Доп. информация",
                                        number: `Наработка, м/час: ${data.operating_time}`,
                                        value: ``,
                                        description: `Организация, проводившая ТО: ${data.service.fullname}`,
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="modal-content__item">
                                        {item.icon}
                                        <div className="modal-content__item-label">
                                            {item.label}
                                        </div>
                                        <div className="modal-content__item-number">
                                            {item.number}
                                        </div>
                                        <div className="modal-content__item-value">
                                            {item.value}
                                        </div>
                                        <div className="modal-content__item-desc">
                                            {item.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="action-buttons">
                            <div className="edit-btn">
                                <button onClick={editMaintenance}>
                                    Редактировать
                                </button>
                            </div>
                            <div className="delete-btn">
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className={isDeleting ? "deleting" : ""}
                                >
                                    {isDeleting ? 'Удаление...' : 'Удалить'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <MaintenanceForm
                    initialData={data}
                    onClose={() => {
                        setShowEditForm(false);
                        onClose();
                    }}
                />
            )}
        </>

    );
};

export default MaintenanceDetailed;