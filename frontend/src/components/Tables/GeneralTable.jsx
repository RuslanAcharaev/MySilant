import React, {useEffect, useMemo, useState} from 'react';
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import {AgGridReact} from "ag-grid-react";
import {myTheme} from "../../utils/theme.js";
import {useInfoStore} from "../../store/infoStore.js";
import "../../styles/components/GeneralTable.scss";
import {AG_GRID_LOCALE_RU} from "../../utils/Locale.js"
import GeneralDetailed from "../Detailed/GeneralDetailed.jsx";
import {useAuthStore} from "../../store/authStore.js";
import GeneralForm from "../Forms/GeneralForm.jsx";

ModuleRegistry.registerModules([AllCommunityModule]);

const GeneralTable = () => {
    const {
        generalInfo,
        getClients,
        clients
    } = useInfoStore();
    const {role} = useAuthStore();
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDetailedOpen, setDetailedOpen] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [eligibleUser, setEligibleUser] = useState(false);

    useEffect(() => {
        if (role === 'MA') {
            if (!clients) {
                getClients();
            }
            setEligibleUser(true);
        }
    }, [role]);

    const createVehicle = () => {
        setShowCreateForm(true);
    }

    const handleRowClick = (params) => {
        setSelectedRow(params.data);
        setDetailedOpen(true);
    }

    const defaultColDef = useMemo(() => {
        return {
            resizable: false,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            flex: 1,
        }
    }, []);
    const colDefs = [
        {
            headerName: "Зав. № машины",
            field: "factory_number",
            minWidth: 100,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Модель техники",
            field: "vehicle_model.name",
            minWidth: 110,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Модель двигателя",
            field: "engine_model.name",
            minWidth: 110,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Зав. № двигателя",
            field: "engine_number",
            minWidth: 110,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Модель трансмиссии",
            field: "transmission_model.name",
            minWidth: 120,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Зав. № трансмиссии",
            field: "transmission_number",
            minWidth: 120,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Модель ведущего моста",
            field: "drive_axle_model.name",
            minWidth: 110,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Зав. № ведущего моста",
            field: "drive_axle_number",
            minWidth: 110,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Модель управляемого моста",
            field: "steering_axle_model.name",
            minWidth: 130,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Зав. № управляемого моста",
            field: "steering_axle_number",
            minWidth: 130,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Договор поставки №, дата",
            field: "supply_contract",
            minWidth: 170,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Дата отгрузки с завода",
            field: "shipping_date",
            minWidth: 120,
            maxWidth: 180,
            sort: 'asc'
        },
        {
            headerName: "Грузополучатель (конечный потребитель)",
            field: "consignee",
            minWidth: 170,
            maxWidth: 180,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Адрес поставки (эксплуатации)",
            field: "delivery_address",
            minWidth: 170,
            wrapText: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Комплектация (доп. опции)",
            field: "equipment",
            minWidth: 170,
            wrapText: true,
            valueFormatter: p => (p.value.length > 45 ? p.value.slice(0, 45) + '...' : p.value),
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Клиент",
            field: "client.fullname",
            minWidth: 170,
            maxWidth: 180,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Сервисная компания",
            field: "service.fullname",
            minWidth: 170,
            maxWidth: 180,
            filter: "agTextColumnFilter",
        },
    ]

    return (
        <div className="general-info">
            <div className="general-info__header">
                {eligibleUser && (
                    <div className="create">
                        <button onClick={createVehicle} className="create-btn">
                            Добавить машину
                        </button>
                    </div>
                )}
            </div>
            <div className="general-info__table">
                <AgGridReact
                    style={{height: "100%"}}
                    rowData={generalInfo}
                    defaultColDef={defaultColDef}
                    columnDefs={colDefs}
                    className="ag-theme-material"
                    headerHeight={60}
                    suppressMovableColumns={true}
                    suppressRowHoverHighlight={false}
                    domLayout="autoHeight"
                    theme={myTheme}
                    defaultSortModel={[
                        {colId: 'shipping_date', sort: 'asc'}
                    ]}
                    localeText={AG_GRID_LOCALE_RU}
                    onRowClicked={handleRowClick}
                />
            </div>
            {showCreateForm && (
                <GeneralForm
                    onClose={() => {
                        setShowCreateForm(false);
                    }}
                />
            )}
            <GeneralDetailed
                isOpen={isDetailedOpen}
                onClose={() => setDetailedOpen(false)}
                data={selectedRow || {}}
                eligible={eligibleUser}
            />
        </div>
    );
};

export default GeneralTable;