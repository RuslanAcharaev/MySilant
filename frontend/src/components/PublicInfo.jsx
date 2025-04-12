import React, {useMemo, useState} from 'react';
import {infoService} from "../service/infoService.js";
import "../styles/components/PublicInfo.scss"
import {useForm} from "react-hook-form";
import {AllCommunityModule, ModuleRegistry, themeMaterial} from 'ag-grid-community';
import {AgGridReact} from "ag-grid-react";
import DocsIcon from "../assets/images/MainPage/docs-icon.svg?react"
import ClockIcon from "./ClockIcon.jsx";

ModuleRegistry.registerModules([AllCommunityModule]);

const PublicInfo = () => {
    const [vehicleData, setVehicleData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const defaultColDef = useMemo(() => {
        return {
            resizable: false,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            sortable: false,
            flex: 1,
        }
    }, []);
    const colDefs = [
        {
            headerName: "Зав. № машины",
            field: "factory_number",
            minWidth: 100,
        },
        {
            headerName: "Модель техники",
            field: "vehicle_model",
            minWidth: 100,
        },
        {
            headerName: "Модель двигателя",
            field: "engine_model",
            minWidth: 110,
        },
        {
            headerName: "Зав. № двигателя",
            field: "engine_number",
            minWidth: 110,
        },
        {
            headerName: "Модель трансмиссии",
            field: "transmission_model",
            minWidth: 120,
        },
        {
            headerName: "Зав. № трансмиссии",
            field: "transmission_number",
            minWidth: 140,
        },
        {
            headerName: "Модель ведущего моста",
            field: "drive_axle_model",
            minWidth: 140,
        },
        {
            headerName: "Зав. № ведущего моста",
            field: "drive_axle_number",
            minWidth: 150,
        },
        {
            headerName: "Модель управляемого моста",
            field: "steering_axle_model",
            minWidth: 170,
        },
        {
            headerName: "Зав. № управляемого моста",
            field: "steering_axle_number",
            minWidth: 170,
        },
    ]

    const myTheme = themeMaterial.withParams({
        headerColumnBorder: {color: '#949494'},
        headerColumnBorderHeight: '100%',
        headerRowBorder: false,
        headerBackgroundColor: "#163E6C",
        headerTextColor: "#FFFFFF",
        columnBorder: true,
        borderColor: "#949494",
        wrapperBorder: true
    })

    const {
        register,
        formState: {errors},
        handleSubmit,
        watch
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            factoryNumber: "",
        }
    })

    const handleSearch = async (value) => {
        setIsLoading(true);
        setError(null);
        setVehicleData(null);

        try {
            const data = await infoService.getVehicle(value.factoryNumber);
            setVehicleData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const factoryNumberValue = watch("factoryNumber");

    return (
        <div className="public-info">
            <h1 className="public-info__title">
                Проверьте комплектацию и технические характеристики техники Силант
            </h1>
            <form onSubmit={handleSubmit(handleSearch)} className="public-info__form">
                <DocsIcon className="docs-icon"/>
                <div className="form-group">
                    <div className="input-wrapper">
                        <input
                            id="factoryNumber"
                            placeholder="Заводской номер"
                            className={factoryNumberValue && errors.factoryNumber ? "error" : ""}
                            {
                                ...register("factoryNumber", {
                                    required: "Обязательное поле",
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
                <button
                    type="submit"
                    className={`submit-btn`}
                >
                    Поиск
                </button>
            </form>
            {isLoading ? (
                <div className="public-info__loading">
                    <ClockIcon/>
                    <p className="loading-text">Загрузка данных...</p>
                </div>
            ) : (vehicleData && (
                <div className="public-info__table">
                    <AgGridReact
                        rowData={[vehicleData]}
                        defaultColDef={defaultColDef}
                        columnDefs={colDefs}
                        className="ag-theme-material"
                        headerHeight={60}
                        rowHeight={48}
                        suppressMovableColumns={true}
                        suppressRowHoverHighlight={false}
                        domLayout="autoHeight"
                        theme={myTheme}
                    />
                </div>
            ))}
            {error && (
                <div className="public-info__error">
                    {error}
                </div>
            )}
        </div>
    );
};

export default PublicInfo;