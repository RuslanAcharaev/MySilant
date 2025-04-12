import React, {useEffect, useMemo, useState} from 'react';
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import {AgGridReact} from "ag-grid-react";
import {myTheme} from "../../utils/theme.js";
import {useInfoStore} from "../../store/infoStore.js";
import {AG_GRID_LOCALE_RU} from "../../utils/Locale.js";
import "../../styles/components/MaintenanceTable.scss";
import MaintenanceDetailed from "../Detailed/MaintenanceDetailed.jsx";
import {filterInfoByVehicle} from "../../utils/filters.js";
import MaintenanceForm from "../Forms/MaintenanceForm.jsx";

ModuleRegistry.registerModules([AllCommunityModule]);

const MaintenanceTable = () => {
    const {
        maintenanceInfo,
        uniqueVehicles
    } = useInfoStore();
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDetailedOpen, setDetailedOpen] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const createMaintenance = () => {
        setShowCreateForm(true);
    }

    const handleRowClick = (params) => {
        setSelectedRow(params.data);
        setDetailedOpen(true);
    };

    const filteredMaintenanceInfo = useMemo(() =>
        filterInfoByVehicle(maintenanceInfo, selectedVehicle),
        [maintenanceInfo, selectedVehicle]
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
        },
        {
            headerName: "Вид ТО",
            field: "maintenance_type.name",
            minWidth: 100,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Дата проведения ТО",
            field: "maintenance_date",
            minWidth: 110,
            sort: 'asc',
            filter: "agDateColumnFilter",
        },
        {
            headerName: "Наработка, м/час",
            field: "operating_time",
            minWidth: 110,
            filter: "agNumberColumnFilter",
        },
        {
            headerName: "№ заказ-наряда",
            field: "work_order_number",
            minWidth: 120,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Дата заказ-наряда",
            field: "work_order_date",
            minWidth: 140,
            filter: "agDateColumnFilter",
        },
        {
            headerName: "Организация, проводившая ТО",
            field: "service.fullname",
            minWidth: 240,
            filter: "agTextColumnFilter",
        }
    ]

    return (
        <div className="maintenance-info">
            <div className="maintenance-info__header">
                <div className="create">
                    <button onClick={createMaintenance} className="create-btn">
                        Добавить информацию о ТО
                    </button>
                </div>
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
            <div className="maintenance-info__table">
                <AgGridReact
                    style={{height: "100%"}}
                    rowData={filteredMaintenanceInfo}
                    defaultColDef={defaultColDef}
                    columnDefs={colDefs}
                    className="ag-theme-material"
                    headerHeight={60}
                    suppressMovableColumns={true}
                    suppressRowHoverHighlight={false}
                    domLayout="autoHeight"
                    theme={myTheme}
                    defaultSortModel={[
                        {colId: 'maintenance_date', sort: 'asc'}
                    ]}
                    localeText={AG_GRID_LOCALE_RU}
                    onRowClicked={handleRowClick}
                />
            </div>
            {showCreateForm && (
                <MaintenanceForm
                    onClose={() => {
                        setShowCreateForm(false);
                    }}
                />
            )}
            <MaintenanceDetailed
                isOpen={isDetailedOpen}
                onClose={() => setDetailedOpen(false)}
                data={selectedRow || {}}
            />
        </div>
    );
};

export default MaintenanceTable;