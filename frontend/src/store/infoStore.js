import {create} from "zustand";
import {createJSONStorage, persist} from 'zustand/middleware';
import {infoService} from "../service/infoService.js";
import {getUniqueVehicles} from "../utils/filters.js";

const initialState = {
    generalInfo: null,
    generalInfoLoading: false,
    generalInfoError: null,
    maintenanceInfo: null,
    maintenanceInfoLoading: false,
    maintenanceInfoError: null,
    complaintsInfo: null,
    complaintsInfoLoading: false,
    complaintsInfoError: null,
    referenceBooks: null,
    referenceBooksError: null,
    uniqueVehicles: null,
    serviceOrganizations: null,
    serviceOrganizationsError: null,
    clients: null,
    clientsError: null,
}

const useInfoStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            setGeneralInfo: (generalInfo) => set({generalInfo}),
            setGeneralInfoLoading: (generalInfoLoading) => set({generalInfoLoading}),
            setGeneralInfoError: (generalInfoError) => set({generalInfoError}),
            setMaintenanceInfo: (maintenanceInfo) => set({maintenanceInfo}),
            setMaintenanceInfoLoading: (maintenanceInfoLoading) => set({maintenanceInfoLoading}),
            setMaintenanceInfoError: (maintenanceInfoError) => set({maintenanceInfoError}),
            setComplaintsInfo: (complaintsInfo) => set({complaintsInfo}),
            setComplaintsInfoLoading: (complaintsInfoLoading) => set({complaintsInfoLoading}),
            setComplaintsInfoError: (complaintsInfoError) => set({complaintsInfoError}),
            setReferenceBooks: (referenceBooks) => set({referenceBooks}),
            setReferenceBooksError: (referenceBooksError) => set({referenceBooksError}),
            setUniqueVehicles: (uniqueVehicles) => set({uniqueVehicles}),
            setServiceOrganizations: (serviceOrganizations) => set({serviceOrganizations}),
            setServiceOrganizationsError: (serviceOrganizationsError) => set({serviceOrganizationsError}),
            setClients: (clients) => set({clients}),
            setClientsError: (clients) => set({clients}),

            getGeneralInfo: async () => {
                const {setGeneralInfo, setGeneralInfoLoading, setGeneralInfoError, setUniqueVehicles} = get();

                try {
                    // console.log('1.1 Начало получения общей информации');
                    setGeneralInfoError(null);
                    setGeneralInfoLoading(true);

                    const response = await infoService.getVehicles();
                    console.log('1.2 Получена общая информация: ', response);
                    setGeneralInfo(response);
                    setUniqueVehicles(getUniqueVehicles(response));
                } catch (error) {
                    setGeneralInfoError(error);
                    return false;
                } finally {
                    setGeneralInfoLoading(false);
                }

                return true;
            },

            updateVehicleInfo: (updatedVehicle) =>
                set((state) => ({
                    generalInfo: state.generalInfo.map(item =>
                        item.id === updatedVehicle.id ? updatedVehicle : item
                    )
                })),

            addVehicle: (vehicle) =>
                set((state) => ({
                    generalInfo: [...state.generalInfo, vehicle],
                    uniqueVehicles: [...state.uniqueVehicles, {
                        id: vehicle.id,
                        number: vehicle.factory_number
                    }],
                })),

            deleteVehicle: (deletedVehicle) =>
                set((state) => ({
                    generalInfo: state.generalInfo.filter(item => item.id !== deletedVehicle),
                    maintenanceInfo: state.maintenanceInfo.filter(item => item.vehicle_id !== deletedVehicle),
                    complaintsInfo: state.complaintsInfo.filter(item => item.vehicle_id !== deletedVehicle),
                    uniqueVehicles: state.uniqueVehicles.filter(item => item.id !== deletedVehicle),
                })),

            getMaintenanceInfo: async () => {
                const {
                    setMaintenanceInfo,
                    setMaintenanceInfoLoading,
                    setMaintenanceInfoError,

                } = get();

                try {
                    // console.log('2.1 Начало получения информации о ТО');
                    setMaintenanceInfoError(null);
                    setMaintenanceInfoLoading(true);

                    const response = await infoService.getMaintenances();
                    // console.log('2.2 Получена информация о ТО: ', response);
                    setMaintenanceInfo(response);
                } catch (error) {
                    setMaintenanceInfoError(error);
                    return false;
                } finally {
                    setMaintenanceInfoLoading(false);
                }

                return true;
            },

            updateMaintenance: (updatedMaintenance) =>
                set((state) => ({
                    maintenanceInfo: state.maintenanceInfo.map(item =>
                        item.id === updatedMaintenance.id ? updatedMaintenance : item
                    )
                })),

            addMaintenance: (maintenance) =>
                set((state) => ({
                    maintenanceInfo: [...state.maintenanceInfo, maintenance],
                })),

            deleteMaintenance: (deletedMaintenance) =>
                set((state) => ({
                    maintenanceInfo: state.maintenanceInfo.filter(item => item.id !== deletedMaintenance)
                })),

            getComplaintsInfo: async () => {
                const {setComplaintsInfo, setComplaintsInfoLoading, setComplaintsInfoError} = get();

                try {
                    // console.log('3.1 Начало получения информации о рекламациях');
                    setComplaintsInfoError(null);
                    setComplaintsInfoLoading(true);

                    const response = await infoService.getComplaints();
                    console.log('3.2 Получена информация о рекламациях: ', response);
                    setComplaintsInfo(response);
                } catch (error) {
                    setComplaintsInfoError(error);
                    return false;
                } finally {
                    setComplaintsInfoLoading(false);
                }

                return true;
            },

            updateComplaint: (updatedComplaint) =>
                set((state) => ({
                    complaintsInfo: state.complaintsInfo.map(item =>
                        item.id === updatedComplaint.id ? updatedComplaint : item
                    )
                })),

            addComplaint: (complaint) =>
                set((state) => ({
                    complaintsInfo: [...state.complaintsInfo, complaint],
                })),

            deleteComplaint: (deletedComplaint) =>
                set((state) => ({
                    complaintsInfo: state.complaintsInfo.filter(item => item.id !== deletedComplaint)
                })),

            getReferenceBooks: async () => {
                const {setReferenceBooks, setReferenceBooksError} = get();

                try {
                    // console.log('4.1 Начало получения информации о справочниках');
                    setReferenceBooksError(null);

                    const response = await infoService.getReferenceBooks();
                    console.log('4.2 Получена информация о справочниках: ', response);
                    setReferenceBooks(response);
                } catch (error) {
                    setReferenceBooksError(error);
                    return false;
                }

                return true;
            },

            updateReferenceBook: (updatedReferenceBook) =>
                set((state) => ({
                    referenceBooks: state.referenceBooks.map(item =>
                        item.id === updatedReferenceBook.id ? updatedReferenceBook : item
                    )
                })),

            addReferenceBook: (referenceBook) =>
                set((state) => ({
                    referenceBooks: [...state.referenceBooks, referenceBook],
                })),

            deleteReferenceBook: (deletedReferenceBook) =>
                set((state) => ({
                    referenceBooks: state.referenceBooks.filter(item => item.id !== deletedReferenceBook)
                })),

            getServiceOrganizations: async () => {
                const {setServiceOrganizations, setServiceOrganizationsError} = get();

                try {
                    // console.log('5.1 Начало получения информации о сервисных организациях');
                    setServiceOrganizationsError(null);

                    const response = await infoService.getServiceOrganizations();
                    console.log('5.2 Получена информация о сервисных организациях: ', response);
                    setServiceOrganizations(response);
                } catch (error) {
                    setServiceOrganizationsError(error);
                    return false;
                }

                return true;
            },

            getClients: async () => {
                const {setClients, setClientsError} = get();

                try {
                    // console.log('7.1 Начало получения информации о клиентах');
                    setClientsError(null);

                    const response = await infoService.getClients();
                    console.log('7.2 Получена информация о клиентах: ', response);
                    setClients(response);
                } catch (error) {
                    setClientsError(error);
                    return false;
                }

                return true;
            },

            clearInfoStore: () => {
                console.log('6.1 Начало очистки info-store')
                set(initialState);
                console.log('6.2 Info-store успешно очищен')
            },
        }),
        {
            name: 'info-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                generalInfo: state.generalInfo,
                maintenanceInfo: state.maintenanceInfo,
                complaintsInfo: state.complaintsInfo,
                uniqueVehicles: state.uniqueVehicles,
                serviceOrganizations: state.serviceOrganizations,
                referenceBooks: state.referenceBooks,
                clients: state.clients,
            })
        }
    )
);

export {useInfoStore};