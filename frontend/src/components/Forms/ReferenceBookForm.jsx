import React, {useEffect, useState} from 'react';
import {useInfoStore} from "../../store/infoStore.js";
import {useForm} from "react-hook-form";
import {infoService} from "../../service/infoService.js";
import {getUniqueTypes} from "../../utils/filters.js";

const ReferenceBookForm = ({ initialData, onClose, setSelectedType, setSelectedName }) => {
    const {
        register,
        formState: { errors, isSubmitting},
        handleSubmit,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            referenceType: initialData?.type || "",
            referenceName: initialData?.name || "",
            referenceDescription: initialData?.description || "",
        }
    });

    const {
        referenceBooks,
        updateReferenceBook,
        addReferenceBook,
    } = useInfoStore();

    const [referenceTypes, setReferenceTypes] = useState(getUniqueTypes(referenceBooks))


    useEffect(() => {
        setReferenceTypes(getUniqueTypes(referenceBooks));
    }, [referenceBooks]);

    const onSubmit = async (values) => {
        try {
            if (initialData) {
                const response = await infoService.updateReferenceBook(initialData?.id, values);
                updateReferenceBook(response);
                setSelectedName('')
                setSelectedType('');
            } else {
                const response = await infoService.createReferenceBook(values);
                addReferenceBook(response);
                setSelectedName('')
                setSelectedType('');
            }
            onClose?.()
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="modal-overlay">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-container">
                    <div className="form-header">
                        <div className="form-title">
                            {initialData ? 'Редактирование справочника' : 'Добавление справочника'}
                        </div>
                    </div>
                    <div className="form-body reference">
                        <div className="form-group">
                            <label htmlFor="referenceType">
                                Тип справочника
                            </label>
                            <div className="input-wrapper">
                                <select
                                    id="select-referenceType"
                                    className="select-referenceType"
                                    {...register("referenceType", {
                                        required: "Обязательное поле",
                                    })}
                                >
                                    <option value="">Тип справочника</option>
                                    {referenceTypes.map(type => (
                                        <option key={type.type} value={type.type}>
                                            {type.display}
                                        </option>
                                    ))}
                                </select>
                                <div className="error-container">
                                    {errors.referenceTypes && (
                                        <span className="error-message">{errors.referenceTypes.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="referenceName">
                                Название
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="referenceName"
                                    {
                                        ...register("referenceName", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.referenceName && (
                                        <span className="error-message">{errors.referenceName.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="referenceDescription">
                                Описание
                            </label>
                            <div className="input-wrapper">
                                <textarea
                                    id="referenceDescription"
                                    {
                                        ...register("referenceDescription", {
                                            required: "Обязательное поле",
                                        })
                                    }
                                />
                                <div className="error-container">
                                    {errors.referenceDescription && (
                                        <span className="error-message">{errors.referenceDescription.message}</span>
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

export default ReferenceBookForm;