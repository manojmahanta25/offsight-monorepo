import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ClientModel} from "./client.model";

@Table({tableName: 'client_app_settings', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at'})
export class ClientAppSettingsModel extends Model<ClientAppSettingsModel> {

    @Column({field: 'client_app_setting_id', type: DataType.BIGINT, primaryKey: true, autoIncrement: true})
    clientAppSettingId: number;

    @ForeignKey(() => ClientModel)
    @Column({field: 'client_id', type: DataType.BIGINT, references: {model: ClientModel, key: 'client_id'}})
    clientId: number;

    @Column({field: 'client_app_setting_setup_range', type: DataType.FLOAT, defaultValue: 0})
    clientAppSettingSetupRange: number;

    @Column({field: 'client_app_setting_device_range', type: DataType.FLOAT, defaultValue: 0})
    clientAppSettingDeviceRange: number;

    @Column({field: 'client_app_setting_humidity_range', type: DataType.INTEGER, defaultValue: 0})
    clientAppSettingHumidityRange: number;

    @Column({field: 'client_app_setting_temperature_range', type: DataType.INTEGER, defaultValue: 0})
    clientAppSettingTemperatureRange: number;

    @Column({field: 'client_app_setting_zoneupdate_popuptime', type: DataType.INTEGER})
    clientAppSettingZoneupdatePopuptime: number;

    @Column({field: 'client_app_setting_pause_production', type: DataType.TINYINT, defaultValue: false})
    clientAppSettingPauseProduction: boolean;

    @Column({field: 'client_app_setting_pause_production_user_id', type: DataType.INTEGER})
    clientAppSettingPauseProductionUserId: number;

    @Column({field: 'client_app_setting_tasks_csv_in_progress', type: DataType.TINYINT, defaultValue: false})
    clientAppSettingTasksCsvInProgress: boolean;

    @Column({field: 'client_app_setting_tasks_csv_in_progress_user_id', type: DataType.INTEGER})
    clientAppSettingTasksCsvInProgressUserId: number;

    @Column({field: 'client_app_setting_tasks_csv_message', type: DataType.STRING})
    clientAppSettingTasksCsvMessage: string;

    @Column({field: 'client_app_setting_part_csv_in_progress', type: DataType.TINYINT, defaultValue: false})
    clientAppSettingPartCsvInProgress: boolean;

    @Column({field: 'client_app_setting_part_csv_in_progress_user_id', type: DataType.INTEGER})
    clientAppSettingPartCsvInProgressUserId: number;

    @Column({field: 'client_app_setting_part_csv_message', type: DataType.STRING})
    clientAppSettingPartCsvMessage: string;

    @Column({field: 'client_app_setting_is_ap_to_zone_mapping_on', type: DataType.TINYINT, defaultValue: false})
    clientAppSettingIsApToZoneMappingOn: boolean;

    @Column({field: 'client_aruba_location_id', type: DataType.STRING})
    clientArubaLocationId: string;

    @Column({field: 'client_aruba_application_token', type: DataType.STRING})
    clientArubaApplicationToken: string;

    @Column({field: 'client_app_setting_button_success_text', type: DataType.STRING, defaultValue: 'SUCCESS'})
    clientAppSettingButtonSuccessText: string;

    @Column({field: 'success_button_enable', type: DataType.TINYINT, defaultValue: true})
    successButtonEnable: boolean;

    @Column({field: 'client_app_setting_button_fail_text', type: DataType.STRING, defaultValue: 'FAIL'})
    clientAppSettingButtonFailText: string;

    @Column({field: 'fail_button_enable', type: DataType.TINYINT, defaultValue: true})
    failButtonEnable: boolean;

    @Column({field: 'client_app_setting_button_comment_text', type: DataType.STRING, defaultValue: 'SAVE'})
    clientAppSettingButtonCommentText: string;

    @Column({field: 'comment_button_enable', type: DataType.TINYINT, defaultValue: true})
    commentButtonEnable: boolean;

    @Column({field: 'client_app_setting_button_assign_text', type: DataType.STRING, defaultValue: 'ASSIGN'})
    clientAppSettingButtonAssignText: string;

    @Column({field: 'assign_button_enable', type: DataType.TINYINT, defaultValue: true})
    assignButtonEnable: boolean;

    @Column({field: 'allow_orders_in_multiple_zones', type: DataType.BOOLEAN, defaultValue: false})
    allowOrdersInMultipleZones: boolean;

    @Column({field: 'excel_columns_names', type: DataType.TEXT})
    excelColumnsNames: string;

    @Column({field: 'client_app_setting_button_fail_color', type: DataType.STRING})
    clientAppSettingButtonFailColor: string;

    @Column({field: 'client_app_setting_button_comment_color', type: DataType.STRING})
    clientAppSettingButtonCommentColor: string;

    @Column({field: 'client_app_setting_button_assign_color', type: DataType.STRING})
    clientAppSettingButtonAssignColor: string;

    @Column({field: 'client_app_setting_button_success_color', type: DataType.STRING})
    clientAppSettingButtonSuccessColor: string;

    @Column({field: 'last_location_coordinates', type: DataType.TEXT})
    lastLocationCoordinates: string;

}