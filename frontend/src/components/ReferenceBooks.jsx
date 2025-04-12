import React, {useEffect, useMemo, useState} from 'react';
import {LuX} from "react-icons/lu";
import {useInfoStore} from "../store/infoStore.js";
import {filterNamesByType, getUniqueTypes} from "../utils/filters.js";
import "../styles/components/ReferenceBooks.scss";
import {useAuthStore} from "../store/authStore.js";
import ReferenceBookForm from "./Forms/ReferenceBookForm.jsx";
import {infoService} from "../service/infoService.js";

const ReferenceBooks = ({isOpen, onClose}) => {
    const {
        referenceBooks,
        deleteReferenceBook
    } = useInfoStore();
    const {role} = useAuthStore();

    const [selectedType, setSelectedType] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [eligibleUser, setEligibleUser] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const referenceTypes = useMemo(() => {
        if (referenceBooks) {
            return getUniqueTypes(referenceBooks);
        }
    }, [referenceBooks])
    const filteredReferenceBooks = useMemo(() => {
        if (!selectedType) return null;
        return filterNamesByType(referenceBooks, selectedType);
    }, [selectedType]);
    const currentReferenceBook = useMemo(() => {
        if (!selectedName) return null;
        return filteredReferenceBooks.find(item => item.name === selectedName);
    }, [selectedName, selectedType]);

    useEffect(() => {
        if (role === 'MA') {
            setEligibleUser(true);
        }
    }, [role]);

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        setSelectedName('');
    }

    const handleNameChange = (event) => {
        setSelectedName(event.target.value);
    }

    const editReferenceBook = () => {
        setInitialData({
            id: currentReferenceBook.id,
            type: selectedType,
            name: currentReferenceBook.name,
            description: currentReferenceBook.description,
        });
        setShowEditForm(true);
    }
    const createReferenceBook = () => {
        setInitialData(null);
        setShowEditForm(true);
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const confirmed = window.confirm('Вы уверены, что хотите удалить эту запись?');
            if (confirmed) {
                const success = await infoService.deleteReferenceBook(currentReferenceBook.id);
                if (success) {
                    deleteReferenceBook(currentReferenceBook.id);
                    onClose();
                    setSelectedName('');
                    setSelectedType('');
                }
            }
        } catch (error) {
            window.alert('Ошибка при удалении')
            console.error(error)
        } finally {
            setIsDeleting(false);
        }
    }

    if (!isOpen) return null;

    return (
        <>
            {!showEditForm ? (
                <div className="modal-overlay">
                    <div className="modal-container reference">
                        <div className="modal-header">
                            <h2 className="modal-header__title">
                                Справочники
                            </h2>
                            <button
                                onClick={onClose}
                                className="modal-header__close-btn"
                            >
                                <LuX/>
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="modal-content__wrapper">
                                <div className="reference">
                                    <div className="reference__type">
                                        <label className="label">
                                            Тип справочника
                                        </label>
                                        <select
                                            value={selectedType}
                                            onChange={handleTypeChange}
                                        >
                                            <option value="">Выберите тип</option>
                                            {referenceTypes.map(type => (
                                                <option key={type.type} value={type.type}>
                                                    {type.display}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="reference__name">
                                        <label className="label">
                                            Название справочника
                                        </label>
                                        <select
                                            value={selectedName}
                                            onChange={handleNameChange}
                                        >
                                            <option value="">Выберите название</option>
                                            {filteredReferenceBooks?.map(name => (
                                                <option key={name.name} value={name.name}>
                                                    {name.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {selectedName && (
                                        <div className="reference__description">
                                            <label className="label">
                                                Описание
                                            </label>
                                            <p className="description">
                                                {currentReferenceBook.description}
                                            </p>
                                            {eligibleUser && (
                                                <div className="action-buttons">
                                                    <div className="edit-btn">
                                                        <button onClick={editReferenceBook}>
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
                                    )}
                                </div>
                            </div>
                        </div>
                        {eligibleUser && (
                            <div className="action-buttons">
                                <div className="edit-btn">
                                    <button onClick={createReferenceBook}>
                                        Добавить справочник
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <ReferenceBookForm
                    initialData={initialData}
                    onClose={() => {
                        setShowEditForm(false);
                        onClose();
                    }}
                    setSelectedType={setSelectedType}
                    setSelectedName={setSelectedName}
                />
            )}
        </>
    );
};

export default ReferenceBooks;