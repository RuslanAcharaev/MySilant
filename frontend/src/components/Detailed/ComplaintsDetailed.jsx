import React, {useState} from 'react';
import {LuX} from "react-icons/lu";
import MaintenanceIcon from "../../assets/images/MainPage/maintenance-icon.svg?react";
import ComplaintsIcon from "../../assets/images/MainPage/complaints-icon.svg?react";
import DocsIcon from "../../assets/images/MainPage/docs-icon.svg?react";
import ComplaintsForm from "../Forms/ComplaintsForm.jsx";
import {useInfoStore} from "../../store/infoStore.js";
import {infoService} from "../../service/infoService.js";

const ComplaintsDetailed = ({isOpen, onClose, data, eligible}) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {
        deleteComplaint,
    } = useInfoStore();

    if (!isOpen) return null;

    const editComplaint = () => {
        setShowEditForm(true);
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const confirmed = window.confirm('Вы уверены, что хотите удалить эту запись?');
            if (confirmed) {
                const success = await infoService.deleteComplaint(data.id);
                if (success) {
                    deleteComplaint(data.id);
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
                                Рекламация на машину с зав.№ {data.vehicle.number}
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
                                        label: "Отказ",
                                        number: `Дата: ${data.failure_date}`,
                                        value: `Узел: ${data.failure_node?.name}`,
                                        description: `Описание отказа: ${data.failure_description}.
                                Описание узла: ${data.failure_node?.description}`,
                                    },
                                    {
                                        icon: <ComplaintsIcon className="modal-content__item-icon"/>,
                                        label: "Восстановление",
                                        number: `Дата: ${data.recovery_date}`,
                                        value: `Способ восстановления: ${data.recovery_method?.name}`,
                                        description: `Описание: ${data.recovery_method?.description} 
                                        ${data.spare_parts ? 'Используемые запасные части: ' + data.spare_parts : ''}`,
                                    },
                                    {
                                        icon: <DocsIcon className="modal-content__item-icon"/>,
                                        label: "Доп. информация",
                                        number: `Наработка, м/час: ${data.operating_time}`,
                                        value: `Время простоя техники: ${data.downtime}`,
                                        description: `Сервисная компания: ${data.service.fullname}`,
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
                        {eligible && (
                            <div className="action-buttons">
                                <div className="edit-btn">
                                    <button onClick={editComplaint}>
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
                        )}
                    </div>
                </div>
            ) : (
                <ComplaintsForm
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

export default ComplaintsDetailed;