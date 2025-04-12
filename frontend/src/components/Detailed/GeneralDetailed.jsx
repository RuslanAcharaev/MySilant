import React, {useState} from 'react';
import {LuX} from "react-icons/lu";
import "../../styles/components/GeneralDetailed.scss";
import VehicleIcon from "../../assets/images/MainPage/vehicle-icon.svg?react";
import TransmissionIcon from "../../assets/images/MainPage/transmission-icon.svg?react";
import EngineIcon from "../../assets/images/MainPage/engine-icon.svg?react";
import DriveAxleIcon from "../../assets/images/MainPage/drive-axle-icon.svg?react";
import SteeringAxleIcon from "../../assets/images/MainPage/steering-axle-icon.svg?react";
import LocationIcon from "../../assets/images/MainPage/location-icon.svg?react";
import ShippingIcon from "../../assets/images/MainPage/shipping-icon.svg?react";
import GeneralForm from "../Forms/GeneralForm.jsx";
import {useInfoStore} from "../../store/infoStore.js";
import {infoService} from "../../service/infoService.js";

const GeneralDetailed = ({isOpen, onClose, data, eligible}) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {
        deleteVehicle,
    } = useInfoStore();

    if (!isOpen) return null;

    const editVehicle = () => {
        setShowEditForm(true);
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const confirmed = window.confirm('Вы уверены, что хотите удалить эту запись о машине, ' +
                'а также все связанные записи ТО и рекламаций?');
            if (confirmed) {
                const success = await infoService.deleteVehicle(data.factory_number);
                if (success) {
                    deleteVehicle(data.id);
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
                                Информация о машине
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
                                        icon: <VehicleIcon className="modal-content__item-icon"/>,
                                        label: "Техника",
                                        number: `Зав. № ${data.factory_number}`,
                                        value: `Модель: ${data.vehicle_model?.name}`,
                                        description: data.vehicle_model?.description,
                                    },
                                    {
                                        icon: <EngineIcon className="modal-content__item-icon"/>,
                                        label: "Двигатель",
                                        number: `Зав. № ${data.engine_number}`,
                                        value: `Модель: ${data.engine_model?.name}`,
                                        description: data.engine_model?.description,
                                    },
                                    {
                                        icon: <TransmissionIcon className="modal-content__item-icon"/>,
                                        label: "Трансмиссия",
                                        number: `Зав. № ${data.transmission_number}`,
                                        value: `Модель: ${data.transmission_model?.name}`,
                                        description: data.transmission_model?.description,
                                    },
                                    {
                                        icon: <DriveAxleIcon className="modal-content__item-icon"/>,
                                        label: "Ведущий мост",
                                        number: `Зав. № ${data.drive_axle_number}`,
                                        value: `Модель: ${data.drive_axle_model?.name}`,
                                        description: data.drive_axle_model?.description,
                                    },
                                    {
                                        icon: <SteeringAxleIcon className="modal-content__item-icon"/>,
                                        label: "Управляемый мост",
                                        number: `Зав. № ${data.steering_axle_number}`,
                                        value: `Модель: ${data.steering_axle_model?.name}`,
                                        description: data.steering_axle_model?.description,
                                    },
                                    {
                                        icon: <LocationIcon className="modal-content__item-icon"/>,
                                        label: "Поставка",
                                        number: `Договор №, дата: ${data.supply_contract}`,
                                        value: `Грузополучатель: ${data.consignee}`,
                                        description: `Адрес: ${data.delivery_address}`,
                                    },
                                    {
                                        icon: <ShippingIcon className="modal-content__item-icon"/>,
                                        label: "Отгрузка",
                                        number: `Дата: ${data.shipping_date}`,
                                        value: `Комплектация: ${data.equipment}`,
                                        description: ``,
                                    },
                                    {label: "Клиент", value: data.client.fullname},
                                    {label: "Сервисная компания", value: data.service.fullname}
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
                                    <button onClick={editVehicle}>
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
                <GeneralForm
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

export default GeneralDetailed;