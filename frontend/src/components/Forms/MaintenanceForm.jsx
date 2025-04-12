import React, {useMemo} from 'react';
import {Controller, useForm} from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
import {useInfoStore} from "../../store/infoStore.js";
import {infoService} from "../../service/infoService.js";
import "../../styles/components/MaintenanceForm.scss"

const MaintenanceForm = ({ initialData, onClose }) => {
    const {
        referenceBooks,
        uniqueVehicles,
        serviceOrganizations,
        updateMaintenance,
        addMaintenance,
    } = useInfoStore();
    const maintenanceTypes = useMemo(() => {
        return referenceBooks.filter(item => item.reference_type === 'maintenance_type')
    }, [referenceBooks]);
    const vehicles = useMemo(() => {
        return uniqueVehicles;
    }, [uniqueVehicles])


    const {
        control,
        register,
        setError,
        reset,
        formState: { errors, isSubmitting},
        handleSubmit,
        watch
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            vehicle: initialData?.vehicle.id || "",
            type: initialData?.maintenance_type?.id || "",
            maintenanceDate: initialData ? new Date(initialData.maintenance_date) : "",
            operatingTime: initialData?.operating_time || "",
            workOrderNumber: initialData?.work_order_number || "",
            workOrderDate: initialData ? new Date(initialData.work_order_date) : "",
            service: initialData?.service.id || "",
        }
    })

    const maintenanceDateValue = watch("maintenanceDate");

    const validateDate = (value) => {
        const selectedDate = new Date(value);
        if (maintenanceDateValue) {
            return selectedDate <= new Date(maintenanceDateValue) ? true : "Не может быть позднее даты проведения ТО";
        }
    };

    const onSubmit = async (values) => {
        try {
            if (initialData) {
                const response = await infoService.updateMaintenance(initialData.id, values);
                updateMaintenance(response);
            } else {
                const response = await infoService.createMaintenance(values);
                addMaintenance(response);
            }
            onClose?.();
        } catch (error) {
            const serverErrors = error.response?.data;
            const fieldMapping = {
                'work_order_number': 'workOrderNumber'
            }

            if (serverErrors) {
                Object.keys(serverErrors).forEach(fieldName => {
                    const formField = fieldMapping[fieldName] || fieldName;
                    setError(formField, {
                        type: 'server',
                        message: serverErrors[fieldName]
                    });
                });

                reset(values, {
                    keepErrors: true,
                    keepDirty: true,
                })
            }
        }
    };

    return (
        <div className="modal-overlay">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-container">
                    <div className="form-header">
                        <div className="form-title">
                            {initialData ? 'Редактирование ТО' : 'Добавление ТО'}
                        </div>
                    </div>
                    <div className="form-body">
                        <div className="form-group">
                            <label htmlFor="vehicle">
                                Зав. № машины
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-vehicle"
                                    className="select-vehicle"
                                    {...register("vehicle", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Зав. № машины</option>
                                    {vehicles.map(vehicle => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.number}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.vehicle && (
                                        <span className="error-message">{errors.vehicle.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">
                                Вид ТО
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-type"
                                    className="select-type"
                                    {...register("type", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Вид ТО</option>
                                    {maintenanceTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.type && (
                                        <span className="error-message">{errors.type.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="maintenanceDate">
                                Дата проведения ТО
                            </label>
                            <div className="input-wrapper">
                                <Controller
                                    control={control}
                                    name="maintenanceDate"
                                    rules={{
                                        required: "Обязательное поле",
                                    }}
                                    render={({field}) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => {
                                                field.onChange(date);
                                                field.onBlur();
                                            }}
                                            onBlur={field.onBlur}
                                            locale={ru}
                                            dateFormat="dd.MM.yyyy"
                                            maxDate={new Date()}
                                            showMonthDropdown
                                            showYearDropdown
                                            yearDropdownItemNumber={5}
                                            dropdownMode="scroll"
                                            enableTabLoop={false}
                                            showIcon
                                            popperProps={{ strategy: 'fixed' }}
                                        />
                                    )}
                                />
                                <div className="error-container">
                                    {errors.maintenanceDate && (
                                        <span className="error-message">{errors.maintenanceDate.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="operatingTime">
                                Наработка, м/час
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="operatingTime"
                                    {
                                        ...register("operatingTime", {
                                            required: "Обязательное поле",
                                            pattern: {
                                                value: /^\d+$/,
                                                message: "Введите числовое значение"
                                            },
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.operatingTime && (
                                        <span className="error-message">{errors.operatingTime.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="workOrderNumber">
                                № заказ-наряда
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="workOrderNumber"
                                    {
                                        ...register("workOrderNumber", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.workOrderNumber && (
                                        <span className="error-message">{errors.workOrderNumber.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="workOrderDate">
                                Дата заказ-наряда
                            </label>
                            <div className="input-wrapper">
                                <Controller
                                    control={control}
                                    name="workOrderDate"
                                    rules={{
                                        required: "Обязательное поле",
                                        validate: validateDate
                                    }}
                                    render={({field}) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => {
                                                field.onChange(date);
                                                field.onBlur();
                                            }}
                                            onBlur={field.onBlur}
                                            locale={ru}
                                            dateFormat="dd.MM.yyyy"
                                            maxDate={new Date()}
                                            showMonthDropdown
                                            showYearDropdown
                                            yearDropdownItemNumber={5}
                                            dropdownMode="scroll"
                                            enableTabLoop={false}
                                            showIcon
                                            popperProps={{ strategy: 'fixed' }}
                                        />
                                    )}
                                />
                                <div className="error-container">
                                    {errors.workOrderDate && (
                                        <span className="error-message">{errors.workOrderDate.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="service">
                                Организация, проводившая ТО
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-service"
                                    className="select-service"
                                    {...register("service", {
                                        required: false,
                                    })}
                                >
                                    <option value="">Самостоятельно</option>
                                    {serviceOrganizations.map(service => (
                                        <option key={service.id} value={service.id}>
                                            {service.fullname}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.service && (
                                        <span className="error-message">{errors.service.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="submit-group">
                        <button
                            type='submit'
                            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button onClick={onClose} className="close-button">
                            Отменить
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MaintenanceForm;