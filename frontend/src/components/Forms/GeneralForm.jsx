import React, {useMemo} from 'react';
import {useInfoStore} from "../../store/infoStore.js";
import {Controller, useForm} from "react-hook-form";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import {infoService} from "../../service/infoService.js";

const GeneralForm = ({ initialData, onClose }) => {
    const {
        referenceBooks,
        serviceOrganizations,
        clients,
        updateVehicleInfo,
        addVehicle,
    } = useInfoStore();

    const vehicleModel = useMemo(() => {
        return referenceBooks.filter(item => item.reference_type === 'vehicle_model')
    }, [referenceBooks]);

    const engineModel = useMemo(() => {
        return referenceBooks.filter(item => item.reference_type === 'engine_model')
    }, [referenceBooks]);

    const transmissionModel = useMemo(() => {
        return referenceBooks.filter(item => item.reference_type === 'transmission_model')
    }, [referenceBooks]);

    const driveAxleModel = useMemo(() => {
        return referenceBooks.filter(item => item.reference_type === 'drive_axle_model')
    }, [referenceBooks]);

    const steeringAxleModel = useMemo(() => {
        return referenceBooks.filter(item => item.reference_type === 'steering_axle_model')
    }, [referenceBooks]);

    const {
        control,
        register,
        formState: {errors, isSubmitting},
        handleSubmit,
        setError,
        reset,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            factoryNumber: initialData?.factory_number || "",
            vehicleModel: initialData?.vehicle_model?.id || "",
            engineModel: initialData?.engine_model?.id || "",
            transmissionModel: initialData?.transmission_model?.id || "",
            driveAxleModel: initialData?.drive_axle_model?.id || "",
            steeringAxleModel: initialData?.steering_axle_model?.id || "",
            engineNumber: initialData?.engine_number || "",
            transmissionNumber: initialData?.transmission_number || "",
            driveAxleNumber: initialData?.drive_axle_number || "",
            steeringAxleNumber: initialData?.steering_axle_number || "",
            supplyContract: initialData?.supply_contract || "",
            shippingDate: initialData ? new Date(initialData.shipping_date) : "",
            consignee: initialData?.consignee || "",
            deliveryAddress: initialData?.delivery_address || "",
            equipment: initialData?.equipment || "",
            service: initialData?.service.id || "",
            client: initialData?.client.id || "",
        }
    });

    const onSubmit = async (values) => {
        try {
            if (initialData) {
                const response = await infoService.updateVehicle(initialData.factory_number, values);
                updateVehicleInfo(response);
            } else {
                const response = await infoService.createVehicle(values);
                addVehicle(response);
            }
            onClose?.()
        } catch (error) {
            console.log(error);
            const serverErrors = error.response?.data;
            const fieldMapping = {
                'drive_axle_number': 'driveAxleNumber',
                'engine_number': 'engineNumber',
                'factory_number': 'factoryNumber',
                'steering_axle_number': 'steeringAxleNumber',
                'transmission_number': 'transmissionNumber'
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
                            {initialData ? 'Редактирование информации' : 'Добавление информации'}
                        </div>
                    </div>
                    <div className="form-body">
                        <div className="form-group">
                            <label htmlFor="factoryNumber">
                                Зав. № машины
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="factoryNumber"
                                    {
                                        ...register("factoryNumber", {
                                            required: "Обязательное поле",
                                            pattern: {
                                                value: /^\d+$/,
                                            },
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.factoryNumber && (
                                        <span className="error-message">{errors.factoryNumber.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="vehicleModel">
                                Модель техники
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-vehicleModel"
                                    className="select-vehicleModel"
                                    {...register("vehicleModel", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Модель техники</option>
                                    {vehicleModel.map(model => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.vehicleModel && (
                                        <span className="error-message">{errors.vehicleModel.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="engineModel">
                                Модель двигателя
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-engineModel"
                                    className="select-engineModel"
                                    {...register("engineModel", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Модель двигателя</option>
                                    {engineModel.map(model => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.engineModel && (
                                        <span className="error-message">{errors.engineModel.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="engineNumber">
                                Зав. № двигателя
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="engineNumber"
                                    {
                                        ...register("engineNumber", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.engineNumber && (
                                        <span className="error-message">{errors.engineNumber.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="transmissionModel">
                                Модель трансмиссии
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-transmissionModel"
                                    className="select-transmissionModel"
                                    {...register("transmissionModel", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Модель трансмиссии</option>
                                    {transmissionModel.map(model => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.transmissionModel && (
                                        <span className="error-message">{errors.transmissionModel.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="transmissionNumber">
                                Зав. № трансмиссии
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="transmissionNumber"
                                    {
                                        ...register("transmissionNumber", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.transmissionNumber && (
                                        <span className="error-message">{errors.transmissionNumber.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driveAxleModel">
                                Модель ведущего моста
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-driveAxleModel"
                                    className="select-driveAxleModel"
                                    {...register("driveAxleModel", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Модель ведущего моста</option>
                                    {driveAxleModel.map(model => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.driveAxleModel && (
                                        <span className="error-message">{errors.driveAxleModel.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driveAxleNumber">
                                Зав. № ведущего моста
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="driveAxleNumber"
                                    {
                                        ...register("driveAxleNumber", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.driveAxleNumber && (
                                        <span className="error-message">{errors.driveAxleNumber.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="steeringAxleModel">
                                Модель управляемого моста
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-steeringAxleModel"
                                    className="select-steeringAxleModel"
                                    {...register("steeringAxleModel", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Модель управляемого моста</option>
                                    {steeringAxleModel.map(model => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.steeringAxleModel && (
                                        <span className="error-message">{errors.steeringAxleModel.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="steeringAxleNumber">
                                Зав. № управляемого моста
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="steeringAxleNumber"
                                    {
                                        ...register("steeringAxleNumber", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.steeringAxleNumber && (
                                        <span className="error-message">{errors.steeringAxleNumber.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="supplyContract">
                                Договор поставки, дата
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="supplyContract"
                                    {
                                        ...register("supplyContract", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.supplyContract && (
                                        <span className="error-message">{errors.supplyContract.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="shippingDate">
                                Дата отгрузки
                            </label>
                            <div className="input-wrapper">
                                <Controller
                                    control={control}
                                    name="shippingDate"
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
                                    {errors.shippingDate && (
                                        <span className="error-message">{errors.shippingDate.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="consignee">
                                Грузополучатель
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="consignee"
                                    {
                                        ...register("consignee", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.consignee && (
                                        <span className="error-message">{errors.consignee.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="deliveryAddress">
                                Адрес поставки
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="deliveryAddress"
                                    {
                                        ...register("deliveryAddress", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.deliveryAddress && (
                                        <span className="error-message">{errors.deliveryAddress.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="equipment">
                                Комплектация
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="equipment"
                                    {
                                        ...register("equipment", {
                                            required: false,
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.equipment && (
                                        <span className="error-message">{errors.equipment.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="client">
                                Клиент
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-client"
                                    className="select-client"
                                    {...register("client", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Клиент</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.fullname}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.client && (
                                        <span className="error-message">{errors.client.message}</span>
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

export default GeneralForm;