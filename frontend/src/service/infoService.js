import api from '../api/api.js';
import {formatDate} from "../utils/formatters.js";

export const infoService = {
    async getVehicle(factoryNumber) {
        try {
            // console.log(`0.0.1 Начало получения информации о машине с номером ${factoryNumber}`);
            const response = await api.get(`/vehicles/${factoryNumber}/`);
            // console.log('0.0.2 Информация получена: ', response.data);
            return response.data;
        } catch (error) {
            throw new Error(error.status === 404
                ? 'Данные не найдены'
                : `Ошибка получения данных о машине с номером ${factoryNumber}`);
        }
    },

    async getVehicles() {
        try {
            const response = await api.get(`/vehicles`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Ошибка получения данных о машинах пользователя')
        }
    },

    async updateVehicle(id, data){
        const prepareData = {
            factory_number: data.factoryNumber,
            vehicle_model_id: data.vehicleModel,
            engine_model_id: data.engineModel,
            engine_number: data.engineNumber,
            transmission_model_id: data.transmissionModel,
            transmission_number: data.transmissionNumber,
            drive_axle_model_id: data.driveAxleModel,
            drive_axle_number: data.driveAxleNumber,
            steering_axle_model_id: data.steeringAxleModel,
            steering_axle_number: data.steeringAxleNumber,
            supply_contract: data.supplyContract,
            shipping_date: formatDate(data.shippingDate),
            consignee: data.consignee,
            delivery_address: data.deliveryAddress,
            equipment: data.equipment,
            client_id: data.client,
            service_id: data.service,
        };

        const response = await api.put(`/vehicles/${id}/`, prepareData);
        return response.data;
    },

    async createVehicle(data){
        const prepareData = {
            factory_number: data.factoryNumber,
            vehicle_model_id: parseInt(data.vehicleModel),
            engine_model_id: parseInt(data.engineModel),
            engine_number: data.engineNumber,
            transmission_model_id: parseInt(data.transmissionModel),
            transmission_number: data.transmissionNumber,
            drive_axle_model_id: parseInt(data.driveAxleModel),
            drive_axle_number: data.driveAxleNumber,
            steering_axle_model_id: parseInt(data.steeringAxleModel),
            steering_axle_number: data.steeringAxleNumber,
            supply_contract: data.supplyContract,
            shipping_date: formatDate(data.shippingDate),
            consignee: data.consignee,
            delivery_address: data.deliveryAddress,
            equipment: data.equipment,
            client_id: parseInt(data.client),
            service_id: parseInt(data.service),
        };

        const response = await api.post(`/vehicles/`, prepareData);
        return response.data;
    },

    async deleteVehicle(id){
        try {
            await api.delete(`/vehicles/${id}/`);
            return true;
        } catch (error) {
            console.error('Ошибка при удалении: ', error);
            throw error;
        }
    },

    async getMaintenances() {
        try {
            const response = await api.get(`/maintenances`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Ошибка получения данных о ТО техники пользователя')
        }
    },

    async updateMaintenance(id, data){
        const prepareData = {
            vehicle_id: data.vehicle,
            maintenance_type_id: data.type,
            maintenance_date: formatDate(data.maintenanceDate),
            operating_time: data.operatingTime,
            work_order_number: data.workOrderNumber,
            work_order_date: formatDate(data.workOrderDate),
            service: data.service,
        };

        const response = await api.put(`/maintenances/${id}/`, prepareData);
        return response.data;
    },

    async deleteMaintenance(id){
        try {
            await api.delete(`/maintenances/${id}/`);
            return true;
        } catch (error) {
            console.error('Ошибка при удалении: ', error);
            throw error;
        }
    },

    async createMaintenance(data) {
        const prepareData = {
            vehicle_id: parseInt(data.vehicle),
            maintenance_type_id: parseInt(data.type),
            maintenance_date: formatDate(data.maintenanceDate),
            operating_time: parseInt(data.operatingTime),
            work_order_number: data.workOrderNumber,
            work_order_date: formatDate(data.workOrderDate),
            service: data.service ? parseInt(data.service) : '',
        };

        const response = await api.post(`/maintenances/`, prepareData);
        return response.data;
    },

    async getComplaints() {
        try {
            const response = await api.get(`/complaints`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Ошибка получения данных о рекламациях на технику пользователя')
        }
    },

    async updateComlaint(id, data){
        const prepareData = {
            vehicle_id: data.vehicle,
            failure_node_id: data.failureNode,
            recovery_method_id: data.recoveryMethod,
            failure_date: formatDate(data.failureDate),
            operating_time: data.operatingTime,
            failure_description: data.failureDescription,
            recovery_date: formatDate(data.recoveryDate),
            spare_parts: data.spareParts,
            service_id: data.service,
        };

        const response = await api.put(`/complaints/${id}/`, prepareData);
        return response.data;
    },

    async createComlaint(data){
        const prepareData = {
            vehicle_id: parseInt(data.vehicle),
            failure_node_id: parseInt(data.failureNode),
            recovery_method_id: parseInt(data.recoveryMethod),
            failure_date: formatDate(data.failureDate),
            operating_time: parseInt(data.operatingTime),
            failure_description: data.failureDescription,
            recovery_date: formatDate(data.recoveryDate),
            spare_parts: data.spareParts,
            service_id: parseInt(data.service),
        };

        const response = await api.post(`/complaints/`, prepareData);
        return response.data;
    },

    async deleteComplaint(id){
        try {
            await api.delete(`/complaints/${id}/`);
            return true;
        } catch (error) {
            console.error('Ошибка при удалении: ', error);
            throw error;
        }
    },

    async getReferenceBooks() {
        try {
            const response = await api.get(`/references`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Ошибка получения справочников')
        }
    },

    async updateReferenceBook(id, data){
        const prepareData = {
            reference_type: data.referenceType,
            name: data.referenceName,
            description: data.referenceDescription,
        };

        const response = await api.put(`/references/${id}/`, prepareData);
        return response.data;
    },

    async createReferenceBook(data){
        const prepareData = {
            reference_type: data.referenceType,
            name: data.referenceName,
            description: data.referenceDescription,
        };

        const response = await api.post(`/references/`, prepareData);
        return response.data;
    },

    async deleteReferenceBook(id){
        try {
            await api.delete(`/references/${id}/`);
            return true;
        } catch (error) {
            console.error('Ошибка при удалении: ', error);
            throw error;
        }
    },

    async getServiceOrganizations() {
        try {
            const response = await api.get(`/services`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Ошибка получения сервисных организаций')
        }
    },

    async getClients() {
        try {
            const response = await api.get(`/clients`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Ошибка получения списка клиентов')
        }
    },
}