import React, {useMemo} from 'react';
import {useInfoStore} from "../../store/infoStore.js";
import {Controller, useForm} from "react-hook-form";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import {infoService} from "../../service/infoService.js";

const ComplaintsForm = ({ initialData, onClose }) => {
    const {
        referenceBooks,
        uniqueVehicles,
        serviceOrganizations,
        updateComplaint,
        addComplaint
    } = useInfoStore();

    const failureNodes = useMemo(() => {
        return referenceBooks.filter(item => item.reference_type === 'failure_node')
    }, [referenceBooks]);

    const recoveryMethods = useMemo(() => {
        return referenceBooks.filter(item => item.reference_type === 'recovery_method')
    }, [referenceBooks]);

    const {
        control,
        register,
        formState: { errors, isSubmitting},
        handleSubmit,
        watch
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            vehicle: initialData?.vehicle.id || "",
            failureDate: initialData ? new Date(initialData.failure_date) : "",
            operatingTime: initialData?.operating_time || "",
            failureNode: initialData?.failure_node?.id || "",
            failureDescription: initialData?.failure_description || "",
            recoveryMethod: initialData?.recovery_method?.id || "",
            spareParts: initialData?.spare_parts || "",
            recoveryDate: initialData ? new Date(initialData.recovery_date) : "",
            service: initialData?.service.id || "",
        }
    })

    const failureDateValue = watch("failureDate");

    const validateDate = (value)=> {
        const selectedDate = new Date(value);
        if (failureDateValue) {
            return selectedDate >= new Date(failureDateValue) ? true : "Не может быть ранее даты отказа";
        }
    };

    const onSubmit = async (values) => {
        try {
            if (initialData) {
                const response = await infoService.updateComlaint(initialData.id, values);
                updateComplaint(response);
            } else {
                const response = await infoService.createComlaint(values);
                addComplaint(response);
            }
            onClose?.();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="modal-overlay">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-container">
                    <div className="form-header">
                        <div className="form-title">
                            {initialData ? 'Редактирование рекламации' : 'Добавление рекламации'}
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
                                    {uniqueVehicles.map(vehicle => (
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
                            <label htmlFor="failureDate">
                                Дата отказа
                            </label>
                            <div className="input-wrapper">
                                <Controller
                                    control={control}
                                    name="failureDate"
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
                                            popperProps={{strategy: 'fixed'}}
                                        />
                                    )}
                                />
                                <div className="error-container">
                                    {errors.failureDate && (
                                        <span className="error-message">{errors.failureDate.message}</span>
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
                            <label htmlFor="failureNode">
                                Узел отказа
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-failureNode"
                                    className="select-failureNode"
                                    {...register("failureNode", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Узел отказа</option>
                                    {failureNodes.map(node => (
                                        <option key={node.id} value={node.id}>
                                            {node.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.failureNode && (
                                        <span className="error-message">{errors.failureNode.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="failureDescription">
                                Описание отказа
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="failureDescription"
                                    {
                                        ...register("failureDescription", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.failureDescription && (
                                        <span className="error-message">{errors.failureDescription.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="recoveryMethod">
                                Способ восстановления
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-recoveryMethod"
                                    className="select-recoveryMethod"
                                    {...register("recoveryMethod", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Способ восстановления</option>
                                    {recoveryMethods.map(method => (
                                        <option key={method.id} value={method.id}>
                                            {method.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.recoveryMethod && (
                                        <span className="error-message">{errors.recoveryMethod.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="spareParts">
                                Используемые запасные части
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="spareParts"
                                    {
                                        ...register("spareParts", {
                                            required: false,
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.spareParts && (
                                        <span className="error-message">{errors.spareParts.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="recoveryDate">
                                Дата восстановления
                            </label>
                            <div className="input-wrapper">
                                <Controller
                                    control={control}
                                    name="recoveryDate"
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
                                            popperProps={{strategy: 'fixed'}}
                                        />
                                    )}
                                />
                                <div className="error-container">
                                    {errors.recoveryDate && (
                                        <span className="error-message">{errors.recoveryDate.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="service">
                                Сервисная компания
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-service"
                                    className="select-service"
                                    {...register("service", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Сервисная компания</option>
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

export default ComplaintsForm;