export const getUniqueVehicles = (data) => {
    return Array.from(data).map(item => ({
        id: item.id,
        number: item.factory_number
    }));
};

export const filterInfoByVehicle = (info, selectedVehicle) => {
    if (!selectedVehicle) return info;
    return info.filter(item => item.vehicle.id === selectedVehicle.id);
};

export const getUniqueTypes = (data) => {
    const types = new Set(data.map(item => item.reference_type));
    return Array.from(types).map(type => ({
        type: type,
        display: data.find(item => item.reference_type === type)?.reference_type_display
    }));
};

export const filterNamesByType = (data, type) => {
    return data.filter(item => item.reference_type === type)
        .map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
        }));
};

