import React, {useEffect, useMemo, useState} from 'react';
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import {AgGridReact} from "ag-grid-react";
import {myTheme} from "../../utils/theme.js";
import {useInfoStore} from "../../store/infoStore.js";
import {AG_GRID_LOCALE_RU} from "../../utils/Locale.js";
import "../../styles/components/ComplaintsTable.scss";
import ComplaintsDetailed from "../Detailed/ComplaintsDetailed.jsx";
import {filterInfoByVehicle} from "../../utils/filters.js";
import ComplaintsForm from "../Forms/ComplaintsForm.jsx";
import {useAuthStore} from "../../store/authStore.js";

ModuleRegistry.registerModules([AllCommunityModule]);

const ComplaintsTable = () => {
    const {
        complaintsInfo,
        uniqueVehicles,
    } = useInfoStore();
    const {role} = useAuthStore();
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDetailedOpen, setDetailedOpen] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [eligibleUser, setEligibleUser] = useState(false);

    const createComplaint = () => {
        setShowCreateForm(true);
    }

    const handleRowClick = (params) => {
        setSelectedRow(params.data);
        setDetailedOpen(true);
    };

    const filteredComplaintsInfo = useMemo(() =>
        filterInfoByVehicle(complaintsInfo, selectedVehicle),
        [complaintsInfo, selectedVehicle]
    );


    const handleVehicleChange = (e) => {
        const value = e.target.value;
        if (value === '') {
            setSelectedVehicle(null);
        } else {
            const vehicle = uniqueVehicles.find(v => v.id === Number(value));
            setSelectedVehicle(vehicle || null)
        }
    };

    useEffect(() => {
        if (selectedVehicle && !uniqueVehicles.some(v => v.id === selectedVehicle.id)) {
            setSelectedVehicle(null);
        }
    }, [uniqueVehicles, selectedVehicle]);

    useEffect(() => {
        if (role === 'MA' || role === 'SO') {
            setEligibleUser(true);
        }
    }, []);

    const defaultColDef = useMemo(() => {
        return {
            resizable: false,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            flex: 1,
            sortable: true,
        }
    }, []);
    const colDefs = [
        {
            headerName: "Зав. № машины",
            field: "vehicle.number",
            minWidth: 100,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Дата отказа",
            field: "failure_date",
            minWidth: 100,
            sort: 'asc',
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Наработка, м/час",
            field: "operating_time",
            minWidth: 100,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Узел отказа",
            field: "failure_node.name",
            minWidth: 110,
            filter: "agTextColumnFilter",
            wrapText: true,
        },
        {
            headerName: "Описание отказа",
            field: "failure_description",
            minWidth: 130,
            filter: "agTextColumnFilter",
            wrapText: true,
        },
        {
            headerName: "Способ восстановления",
            field: "recovery_method.name",
            minWidth: 140,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Используемые запасные части",
            field: "spare_parts",
            minWidth: 130,
            filter: "agTextColumnFilter",
            wrapText: true,
        },
        {
            headerName: "Дата восстановления",
            field: "recovery_date",
            minWidth: 140,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Время простоя техники",
            field: "downtime",
            minWidth: 100,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Сервисная компания",
            field: "service.fullname",
            minWidth: 200,
            filter: "agTextColumnFilter",
        }
    ]

    return (
        <div className="complaints-info">
            <div className={`complaints-info__header ${!eligibleUser ? 'align-right' : ''}`}>
                {eligibleUser && (
                    <div className="create">
                        <button onClick={createComplaint} className="create-btn">
                            Добавить рекламацию
                        </button>
                    </div>
                )}
                <select
                    value={selectedVehicle?.id || ''}
                    onChange={handleVehicleChange}
                    className="vehicle-selector"
                >
                    <option value="">Все машины</option>
                    {uniqueVehicles?.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                            Зав. № {vehicle.number}
                        </option>
                    ))}
                </select>
            </div>
            <div className="complaints-info__table">
                <AgGridReact
                    style={{height: "100%"}}
                    rowData={filteredComplaintsInfo}
                    defaultColDef={defaultColDef}
                    columnDefs={colDefs}
                    className="ag-theme-material"
                    headerHeight={60}
                    suppressMovableColumns={true}
                    suppressRowHoverHighlight={false}
                    domLayout="autoHeight"
                    theme={myTheme}
                    defaultSortModel={[
                        {colId: 'failure_date', sort: 'asc'}
                    ]}
                    localeText={AG_GRID_LOCALE_RU}
                    onRowClicked={handleRowClick}
                />
            </div>
            {showCreateForm && (
                <ComplaintsForm
                    onClose={() => {
                        setShowCreateForm(false);
                    }}
                />
            )}
            <ComplaintsDetailed
                isOpen={isDetailedOpen}
                onClose={() => setDetailedOpen(false)}
                data={selectedRow || {}}
                eligible={eligibleUser}
            />
        </div>
    );
};

export default ComplaintsTable;