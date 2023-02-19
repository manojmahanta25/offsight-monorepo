import {Expose} from "class-transformer";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ApiProperty, ApiPropertyOptional, PartialType} from "@nestjs/swagger";

export class UserGroupMinimalDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    groupName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    loginAccessManagementTool: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    enablePasswordResetNoUserEmail: number;
}

export class UserGroupUpdateDto extends PartialType(UserGroupMinimalDto) {

}



export class UserGroupLoginAccessDto {

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessAlert: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessHistory: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessApps: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessAnalytics: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessDeleteSubmittedTask: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessEnablePauseProduction: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessReporting: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessStartEndProductTool: number;

    @ApiPropertyOptional()
    @IsNumber()
    manageProductFilesAccessOnly: number;

    @ApiPropertyOptional()
    @IsNumber()
    manageInventoryAccessOnly: number;

    @ApiPropertyOptional()
    @IsNumber()
    commentOnly: number;

    @ApiPropertyOptional()
    @IsNumber()
    viewOnly: number;

    @ApiPropertyOptional()
    @IsNumber()
    enableLiveProductNameEdit: number;

    @ApiPropertyOptional()
    @IsNumber()
    enableApplyToMultipleProductNames: number;

    @ApiPropertyOptional()
    @IsNumber()
    dataExportAccess: number;

    @ApiPropertyOptional()
    @IsNumber()
    zoneProgressColorMatch: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideSubtask: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideAddLocation: number;

    @ApiPropertyOptional()
    @IsNumber()
    addTimestampImages: number;

    @ApiPropertyOptional()
    @IsNumber()
    switchDateFormat: number;

    @ApiPropertyOptional()
    @IsNumber()
    enableDragDropProduct: number;

    @ApiPropertyOptional()
    @IsNumber()
    enableEditTaskDescription: number;

    @ApiPropertyOptional()
    @IsNumber()
    enablePauseProductionByView: number;

    @ApiPropertyOptional()
    @IsNumber()
    enableTagZone: number;

}

export class UserGroupAlertDto {

    @ApiPropertyOptional()
    @IsString()
    failedTaskAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    failedTaskEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedSchedulingTimeAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedSchedulingTimeEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedZoneTimeAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedZoneTimeEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    assignedAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    assignedEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    startEndProductAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    startEndProductEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    productionFileUrlAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    productionFileUrlEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    lowWarehouseInventoryAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    lowWarehouseInventoryEmailAlert: string;
}


export class UserGroupSettingDto {
    @ApiPropertyOptional()
    @IsString()
    failedTaskAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    failedTaskEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedSchedulingTimeAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedSchedulingTimeEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedZoneTimeAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedZoneTimeEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    assignedAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    assignedEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    startEndProductAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    startEndProductEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    productionFileUrlAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    productionFileUrlEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    lowWarehouseInventoryAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    lowWarehouseInventoryEmailAlert: string;

    @ApiPropertyOptional()
    @IsNumber()
    zoneLocationPopup: number;

    @ApiPropertyOptional()
    @IsNumber()
    showUsersTaggedInLiveScreen: number;

    @ApiPropertyOptional()
    @IsNumber()
    showTimerForTaskTypes: number;

    @ApiPropertyOptional()
    @IsNumber()
    isSendToLiveOnceAllTaskDoneSetting: number;

    @ApiPropertyOptional()
    @IsNumber()
    isStayOnCompletedTask: number;

    @ApiPropertyOptional()
    @IsNumber()
    moveToNextFormFeature: number;

    @ApiPropertyOptional()
    @IsNumber()
    isProductionOrderNameDisplay: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideTaskNumber: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideTask: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideNormalTaskIcon: number;

    @ApiPropertyOptional()
    @IsNumber()
    showNoOfProductsInZone: number;

    @ApiPropertyOptional()
    @IsNumber()
    expandSidePanelOnDefault: number;

    @ApiPropertyOptional()
    @IsNumber()
    redirectToDuplicate: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideAutoFillIcon: number;

    @ApiPropertyOptional()
    @IsNumber()
    deviceArAccess: number;
}

export class UserGroupUpdateAllDto extends UserGroupUpdateDto{
    @ApiPropertyOptional()
    @IsNumber()
    loginAccessAlert: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessHistory: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessApps: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessAnalytics: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessDeleteSubmittedTask: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessEnablePauseProduction: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessReporting: number;

    @ApiPropertyOptional()
    @IsNumber()
    loginAccessStartEndProductTool: number;

    @ApiPropertyOptional()
    @IsNumber()
    manageProductFilesAccessOnly: number;

    @ApiPropertyOptional()
    @IsNumber()
    manageInventoryAccessOnly: number;

    @ApiPropertyOptional()
    @IsNumber()
    commentOnly: number;

    @ApiPropertyOptional()
    @IsNumber()
    viewOnly: number;

    @ApiPropertyOptional()
    @IsNumber()
    enableLiveProductNameEdit: number;

    @ApiPropertyOptional()
    @IsNumber()
    enableApplyToMultipleProductNames: number;

    @ApiPropertyOptional()
    @IsNumber()
    dataExportAccess: number;

    @ApiPropertyOptional()
    @IsNumber()
    zoneProgressColorMatch: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideSubtask: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideAddLocation: number;

    @ApiPropertyOptional()
    @IsNumber()
    addTimestampImages: number;

    @ApiPropertyOptional()
    @IsNumber()
    switchDateFormat: number;

    @ApiPropertyOptional()
    @IsNumber()
    enableDragDropProduct: number;

    @ApiPropertyOptional()
    @IsNumber()
    enableEditTaskDescription: number;

    @ApiPropertyOptional()
    @IsNumber()
    enablePauseProductionByView: number;

    @ApiPropertyOptional()
    @IsNumber()
    enableTagZone: number;

    @ApiPropertyOptional()
    @IsString()
    failedTaskAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    failedTaskEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedSchedulingTimeAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedSchedulingTimeEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedZoneTimeAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    passedZoneTimeEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    assignedAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    assignedEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    startEndProductAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    startEndProductEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    productionFileUrlAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    productionFileUrlEmailAlert: string;

    @ApiPropertyOptional()
    @IsString()
    lowWarehouseInventoryAppAlert: string;

    @ApiPropertyOptional()
    @IsString()
    lowWarehouseInventoryEmailAlert: string;

    @ApiPropertyOptional()
    @IsNumber()
    zoneLocationPopup: number;

    @ApiPropertyOptional()
    @IsNumber()
    showUsersTaggedInLiveScreen: number;

    @ApiPropertyOptional()
    @IsNumber()
    showTimerForTaskTypes: number;

    @ApiPropertyOptional()
    @IsNumber()
    isSendToLiveOnceAllTaskDoneSetting: number;

    @ApiPropertyOptional()
    @IsNumber()
    isStayOnCompletedTask: number;

    @ApiPropertyOptional()
    @IsNumber()
    moveToNextFormFeature: number;

    @ApiPropertyOptional()
    @IsNumber()
    isProductionOrderNameDisplay: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideTaskNumber: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideTask: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideNormalTaskIcon: number;

    @ApiPropertyOptional()
    @IsNumber()
    showNoOfProductsInZone: number;

    @ApiPropertyOptional()
    @IsNumber()
    expandSidePanelOnDefault: number;

    @ApiPropertyOptional()
    @IsNumber()
    redirectToDuplicate: number;

    @ApiPropertyOptional()
    @IsNumber()
    hideAutoFillIcon: number;

    @ApiPropertyOptional()
    @IsNumber()
    deviceArAccess: number;
}