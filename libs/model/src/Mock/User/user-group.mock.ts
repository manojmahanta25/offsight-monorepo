import mockUserModel, {UserMock} from "@app/model/Mock/User/user.mock";

export let UserGroupMock = [
    {
        "id": 1,
        "clientId": 1,
        "userGroupName": "Admin",
        "loginAccessManagementTool": 1,
        "loginAccessStartEndProductTool": 1,
        "loginAccessAlert": 1,
        "loginAccessHistory": 1,
        "loginAccessAnalytics": 1,
        "loginAccessReporting": 1,
        "loginAccessDeleteSubmittedTask": 1,
        "loginAccessEnablePauseProduction": 1,
        "enablePasswordResetNoUserEmail": 0,
        "failedTaskAppAlert": "0",
        "failedTaskEmailAlert": "",
        "passedSchedulingTimeAppAlert": "",
        "passedSchedulingTimeEmailAlert": "",
        "passedZoneTimeAppAlert": "",
        "passedZoneTimeEmailAlert": "",
        "assignedAppAlert": "",
        "assignedEmailAlert": "",
        "startEndProductAppAlert": "",
        "startEndProductEmailAlert": "",
        "productionFileUrlAppAlert": "",
        "productionFileUrlEmailAlert": "",
        "lowWarehouseInventoryAppAlert": "",
        "lowWarehouseInventoryEmailAlert": "",
        "clientUserGroupIsActive": 1,
        "zoneLocationPopup": 0,
        "showUsersTaggedInLiveScreen": 1,
        "showTimerForTaskTypes": 0,
        "isSendToLiveOnceAllTaskDoneSetting": 0,
        "isStayOnCompletedTask": 0,
        "moveToNextFormFeature": 0,
        "isProductionOrderNameDisplay": 0,
        "hideTaskNumber": 1,
        "commentOnly": 0,
        "viewOnly": 0,
        "zoneProgressColorMatch": 0,
        "enableLiveProductNameEdit": 1,
        "enableApplyToMultipleProductNames": 0,
        "dataExportAccess": 1,
        "hideTask": 0,
        "hideSubtask": 0,
        "hideAddLocation": 0,
        "showNoOfProductsInZone": 1,
        "addTimestampImages": 1,
        "switchDateFormat": 0,
        "userGroupOrder": 1,
        "enableDragDropProduct": 1,
        "hideNormalTaskIcon": 0,
        "hideAutoFillIcon": 0,
        "deviceArAccess": null,
        "expandSidePanelOnDefault": 0,
        "enableEditTaskDescription": 1,
        "manageProductFilesAccessOnly": 0,
        "manageInventoryAccessOnly": 0,
        "redirectToDuplicate": 0,
        "enablePauseProductionByView": 1,
        "loginAccessApps": 1,
        "enableTagZone": 0,
        "created_at": "2021-04-17T16:26:38.000Z",
        "updated_at": "2021-05-17T05:12:43.000Z"
    },
    {
        "id": 2,
        "clientId": 1,
        "userGroupName": "IT Manager",
        "loginAccessManagementTool": 0,
        "loginAccessStartEndProductTool": 1,
        "loginAccessAlert": 1,
        "loginAccessHistory": 1,
        "loginAccessAnalytics": 1,
        "loginAccessReporting": 1,
        "loginAccessDeleteSubmittedTask": 1,
        "loginAccessEnablePauseProduction": 1,
        "enablePasswordResetNoUserEmail": 0,
        "failedTaskAppAlert": "0",
        "failedTaskEmailAlert": "",
        "passedSchedulingTimeAppAlert": "",
        "passedSchedulingTimeEmailAlert": "",
        "passedZoneTimeAppAlert": "",
        "passedZoneTimeEmailAlert": "",
        "assignedAppAlert": "",
        "assignedEmailAlert": "",
        "startEndProductAppAlert": "",
        "startEndProductEmailAlert": "",
        "productionFileUrlAppAlert": "",
        "productionFileUrlEmailAlert": "",
        "lowWarehouseInventoryAppAlert": "",
        "lowWarehouseInventoryEmailAlert": "",
        "clientUserGroupIsActive": 1,
        "zoneLocationPopup": 0,
        "showUsersTaggedInLiveScreen": 1,
        "showTimerForTaskTypes": 0,
        "isSendToLiveOnceAllTaskDoneSetting": 0,
        "isStayOnCompletedTask": 0,
        "moveToNextFormFeature": 0,
        "isProductionOrderNameDisplay": 0,
        "hideTaskNumber": 1,
        "commentOnly": 0,
        "viewOnly": 0,
        "zoneProgressColorMatch": 0,
        "enableLiveProductNameEdit": 1,
        "enableApplyToMultipleProductNames": 0,
        "dataExportAccess": 1,
        "hideTask": 0,
        "hideSubtask": 0,
        "hideAddLocation": 0,
        "showNoOfProductsInZone": 1,
        "addTimestampImages": 1,
        "switchDateFormat": 0,
        "userGroupOrder": 1,
        "enableDragDropProduct": 1,
        "hideNormalTaskIcon": 0,
        "hideAutoFillIcon": 0,
        "deviceArAccess": null,
        "expandSidePanelOnDefault": 0,
        "enableEditTaskDescription": 1,
        "manageProductFilesAccessOnly": 0,
        "manageInventoryAccessOnly": 0,
        "redirectToDuplicate": 0,
        "enablePauseProductionByView": 1,
        "loginAccessApps": 1,
        "enableTagZone": 0,
        "created_at": "2021-04-17T16:26:38.000Z",
        "updated_at": "2021-05-17T05:12:43.000Z"
    },
    {
        "id": 3,
        "clientId": 2,
        "userGroupName": "Admin",
        "loginAccessManagementTool": 1,
        "loginAccessStartEndProductTool": 1,
        "loginAccessAlert": 1,
        "loginAccessHistory": 1,
        "loginAccessAnalytics": 1,
        "loginAccessReporting": 1,
        "loginAccessDeleteSubmittedTask": 1,
        "loginAccessEnablePauseProduction": 1,
        "enablePasswordResetNoUserEmail": 0,
        "failedTaskAppAlert": "0",
        "failedTaskEmailAlert": "",
        "passedSchedulingTimeAppAlert": "",
        "passedSchedulingTimeEmailAlert": "",
        "passedZoneTimeAppAlert": "",
        "passedZoneTimeEmailAlert": "",
        "assignedAppAlert": "",
        "assignedEmailAlert": "",
        "startEndProductAppAlert": "",
        "startEndProductEmailAlert": "",
        "productionFileUrlAppAlert": "",
        "productionFileUrlEmailAlert": "",
        "lowWarehouseInventoryAppAlert": "",
        "lowWarehouseInventoryEmailAlert": "",
        "clientUserGroupIsActive": 1,
        "zoneLocationPopup": 0,
        "showUsersTaggedInLiveScreen": 1,
        "showTimerForTaskTypes": 0,
        "isSendToLiveOnceAllTaskDoneSetting": 0,
        "isStayOnCompletedTask": 0,
        "moveToNextFormFeature": 0,
        "isProductionOrderNameDisplay": 0,
        "hideTaskNumber": 1,
        "commentOnly": 0,
        "viewOnly": 0,
        "zoneProgressColorMatch": 0,
        "enableLiveProductNameEdit": 1,
        "enableApplyToMultipleProductNames": 0,
        "dataExportAccess": 1,
        "hideTask": 0,
        "hideSubtask": 0,
        "hideAddLocation": 0,
        "showNoOfProductsInZone": 1,
        "addTimestampImages": 1,
        "switchDateFormat": 0,
        "userGroupOrder": 1,
        "enableDragDropProduct": 1,
        "hideNormalTaskIcon": 0,
        "hideAutoFillIcon": 0,
        "deviceArAccess": null,
        "expandSidePanelOnDefault": 0,
        "enableEditTaskDescription": 1,
        "manageProductFilesAccessOnly": 0,
        "manageInventoryAccessOnly": 0,
        "redirectToDuplicate": 0,
        "enablePauseProductionByView": 1,
        "loginAccessApps": 1,
        "enableTagZone": 0,
        "created_at": "2021-04-17T16:26:38.000Z",
        "updated_at": "2021-05-17T05:12:43.000Z"
    }
]

const mockUserGroupModel = {
    findOne: jest.fn(),
    // destroy: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
};

mockUserGroupModel.findOne.mockImplementation((options) => {
    let result = UserGroupMock;
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

mockUserGroupModel.create.mockImplementation((options) => {
    return Promise.resolve(options);
});

mockUserGroupModel.findAll.mockImplementation((options) => {
    let result = UserGroupMock;
    if(options.where){
        if(options.where.id){
            result = result.filter((item) => item.id === options.where.id);
        }
        if(options.where.clientId){
            result = result.filter((item) => item.clientId === options.where.clientId);
        }
    }
    return Promise.resolve(result);
});

mockUserGroupModel.update.mockImplementation((data, options) => {
    // update partial properties
    if (options.where) {
        if (options.where.id) {
            UserGroupMock = UserGroupMock.map((user) => {
                if (user.id === options.where.id) {
                    return { ...user, ...data };
                }
                return user;
            });
        }
        if (options.where.clientId) {
            UserGroupMock = UserGroupMock.map((user) => {
                if (user.clientId === options.where.clientId) {
                    return { ...user, ...data };
                }
                return user;
            });
        }
    }
    return Promise.resolve([1, UserGroupMock]);
})


export default mockUserGroupModel;