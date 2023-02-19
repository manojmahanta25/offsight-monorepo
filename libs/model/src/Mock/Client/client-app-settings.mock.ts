export let ClientAppSettingsMock = [
    {
        id: 1,
        clientId: 1,
        clientAppSettingSetupRange: 7,
        clientAppSettingDeviceRange: 7,
        clientAppSettingHumidityRange: 5,
        clientAppSettingTemperatureRange: 5,
        clientAppSettingZoneupdatePopuptime: 5,
        clientAppSettingPauseProduction: true,
        clientAppSettingPauseProductionUserId: 0,
        clientAppSettingTasksCsvInProgress: false,
        clientAppSettingTasksCsvInProgressUserId: 0,
        clientAppSettingTasksCsvMessage: null,
        clientAppSettingPartCsvInProgress: false,
        clientAppSettingPartCsvInProgressUserId: 0,
        clientAppSettingPartCsvMessage: null,
        allowOrdersInMultipleZones: true,
    },
    {
        id: 1,
        clientId: 2,
        clientAppSettingSetupRange: 7,
        clientAppSettingDeviceRange: 7,
        clientAppSettingHumidityRange: 5,
        clientAppSettingTemperatureRange: 5,
        clientAppSettingZoneupdatePopuptime: 5,
        clientAppSettingPauseProduction: true,
        clientAppSettingPauseProductionUserId: 0,
        clientAppSettingTasksCsvInProgress: false,
        clientAppSettingTasksCsvInProgressUserId: 0,
        clientAppSettingTasksCsvMessage: null,
        clientAppSettingPartCsvInProgress: false,
        clientAppSettingPartCsvInProgressUserId: 0,
        clientAppSettingPartCsvMessage: null,
        allowOrdersInMultipleZones: true,
    }
];


const mockClientAppSettingsModel = {
    findOne: jest.fn(),
    update: jest.fn(),
};

mockClientAppSettingsModel.findOne.mockImplementation((options) => {
   let result = ClientAppSettingsMock;
    if(options.where){
        if(options.where.id){
            result = result.filter((item) => item.id === options.where.id);
        }
        if(options.where.clientId){
            result = result.filter((item) => item.clientId === options.where.clientId);
        }

    }
    if (result.length < 1) {
        return Promise.resolve(null);
    }
    return Promise.resolve(result[0]);
});

mockClientAppSettingsModel.update.mockImplementation((data, options) => {
    // update partial properties
    if (options.where) {
        if (options.where.id) {
            ClientAppSettingsMock = ClientAppSettingsMock.map((user) => {
                if (user.id === options.where.id) {
                    return { ...user, ...data };
                }
                return user;
            });
        }
        if (options.where.clientId) {
            ClientAppSettingsMock = ClientAppSettingsMock.map((user) => {
                if (user.clientId === options.where.clientId) {
                    return { ...user, ...data };
                }
                return user;
            });
        }
    }
    return Promise.resolve([1, ClientAppSettingsMock]);
});

export default mockClientAppSettingsModel;