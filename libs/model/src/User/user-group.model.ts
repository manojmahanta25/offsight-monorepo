import {Table, Column, DataType, Model, ForeignKey} from "sequelize-typescript";
import {ClientModel} from "@app/model/Client/client.model";

@Table({tableName: 'user_group', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at'})
export class UserGroupModel extends Model<UserGroupModel> {

    @Column({field: 'id', type: DataType.BIGINT, primaryKey: true, autoIncrement: true})
    id: number;

    @ForeignKey(() => ClientModel)
    @Column({field: 'client_id', type: DataType.BIGINT, references: {model: ClientModel, key: 'client_id'}})
    clientId: number;

    @Column({field: 'client_user_group_name', type: DataType.STRING})
    userGroupName: string;

    @Column({field: 'login_access_management_tool', type: DataType.TINYINT, allowNull: false})
    loginAccessManagementTool: number;

    @Column({field: 'login_access_start_end_product_tool', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    loginAccessStartEndProductTool: number;

    @Column({field: 'login_access_alert', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    loginAccessAlert: number;

    @Column({field: 'login_access_history', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    loginAccessHistory: number;

    @Column({field: 'login_access_analytics', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    loginAccessAnalytics: number;

    @Column({field: 'login_access_reporting', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    loginAccessReporting: number;

    @Column({field: 'login_access_delete_submitted_task', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    loginAccessDeleteSubmittedTask: number;

    @Column({field: 'login_access_enable_pause_production', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    loginAccessEnablePauseProduction: number;

    @Column({field: 'enable_password_reset_no_user_email', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    enablePasswordResetNoUserEmail: number;

    @Column({field: 'failed_task_app_alert', type: DataType.STRING, defaultValue: '0', allowNull: false})
    failedTaskAppAlert: string;

    @Column({field: 'failed_task_email_alert', type: DataType.STRING, defaultValue: '', allowNull: false})
    failedTaskEmailAlert: string;

    @Column({field: 'passed_scheduling_time_app_alert', type: DataType.STRING, defaultValue: '', allowNull: false})
    passedSchedulingTimeAppAlert: string;

    @Column({field: 'passed_scheduling_time_email_alert', type: DataType.STRING, defaultValue: '', allowNull: false})
    passedSchedulingTimeEmailAlert: string;

    @Column({field: 'passed_zone_time_app_alert', type: DataType.STRING, defaultValue: '', allowNull: false})
    passedZoneTimeAppAlert: string;

    @Column({field: 'passed_zone_time_email_alert', type: DataType.STRING, defaultValue: '', allowNull: false})
    passedZoneTimeEmailAlert: string;

    @Column({field: 'assigned_app_alert', type: DataType.STRING, defaultValue: '', allowNull: false})
    assignedAppAlert: string;

    @Column({field: 'assigned_email_alert', type: DataType.STRING, defaultValue: '', allowNull: false})
    assignedEmailAlert: string;

    @Column({field: 'start_end_product_app_alert', type: DataType.STRING, defaultValue: '', allowNull: false})
    startEndProductAppAlert: string;

    @Column({field: 'start_end_product_email_alert', type: DataType.STRING, defaultValue: '', allowNull: false})
    startEndProductEmailAlert: string;

    @Column({field: 'production_file_url_app_alert', type: DataType.STRING, allowNull: true})
    productionFileUrlAppAlert: string;

    @Column({field: 'production_file_url_email_alert', type: DataType.STRING, allowNull: true})
    productionFileUrlEmailAlert: string;

    @Column({field: 'low_warehouse_inventory_app_alert', type: DataType.STRING, allowNull: true})
    lowWarehouseInventoryAppAlert: string;

    @Column({field: 'low_warehouse_inventory_email_alert', type: DataType.STRING, allowNull: true})
    lowWarehouseInventoryEmailAlert: string;

    @Column({field: 'client_user_group_is_active', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    clientUserGroupIsActive: number;

    @Column({field: 'zone_location_popup', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    zoneLocationPopup: number;

    @Column({field: 'show_users_tagged_in_live_screen', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    showUsersTaggedInLiveScreen: number;

    @Column({field: 'show_timer_for_task_types', type: DataType.TINYINT, defaultValue: -1, allowNull: false})
    showTimerForTaskTypes: number;

    @Column({field: 'is_send_to_live_once_all_task_done_setting', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    isSendToLiveOnceAllTaskDoneSetting: number;

    @Column({field: 'is_stay_on_completed_task', type: DataType.TINYINT, defaultValue: -1, allowNull: false})
    isStayOnCompletedTask: number;

    @Column({field: 'move_to_next_form_feature', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    moveToNextFormFeature: number;

    @Column({field: 'is_production_order_name_display', type: DataType.TINYINT, defaultValue: -1, allowNull: false})
    isProductionOrderNameDisplay: number;

    @Column({field: 'hide_task_number', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    hideTaskNumber: number;

    @Column({field: 'comment_only', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    commentOnly: number;

    @Column({field: 'view_only', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    viewOnly: number;

    @Column({field: 'zone_progress_color_match', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    zoneProgressColorMatch: number;

    @Column({field: 'enable_live_product_name_edit', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    enableLiveProductNameEdit: number;

    @Column({field: 'enable_apply_to_multiple_product_names', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    enableApplyToMultipleProductNames: number;

    @Column({field: 'data_export_access', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    dataExportAccess: number;

    @Column({field: 'hide_task', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    hideTask: number;

    @Column({field: 'hide_subtask', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    hideSubtask: number;

    @Column({field: 'hide_add_location', type: DataType.TINYINT, defaultValue: 0})
    hideAddLocation: number;

    @Column({field: 'show_no_of_products_in_zone', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    showNoOfProductsInZone: number;

    @Column({field: 'add_timestamp_images', type: DataType.TINYINT, defaultValue: 1, allowNull: false})
    addTimestampImages: number;

    @Column({field: 'switch_date_format', type: DataType.TINYINT, defaultValue: 0, allowNull: false})
    switchDateFormat: number;

    @Column({field: 'user_group_order', type: DataType.INTEGER, allowNull: true})
    userGroupOrder: number;

    @Column({field: 'enable_drag_drop_product', type: DataType.TINYINT, defaultValue: 1, allowNull: true})
    enableDragDropProduct: number;

    @Column({field: 'hide_normal_task_icon', type: DataType.TINYINT, defaultValue: 0})
    hideNormalTaskIcon: number;

    @Column({field: 'hide_auto_fill_icon', type: DataType.TINYINT, defaultValue: 0})
    hideAutoFillIcon: number;

    @Column({field: 'device_ar_access', type: DataType.TINYINT, defaultValue: 0})
    deviceArAccess: number;

    @Column({field: 'expand_side_panel_on_default', type: DataType.TINYINT, defaultValue: 0})
    expandSidePanelOnDefault: number;

    @Column({field: 'enable_edit_task_description', type: DataType.TINYINT, defaultValue: 0})
    enableEditTaskDescription: number;

    @Column({field: 'manage_product_files_access_only', type: DataType.TINYINT, defaultValue: 0})
    manageProductFilesAccessOnly: number;

    @Column({field: 'manage_inventory_access_only', type: DataType.TINYINT, defaultValue: 0})
    manageInventoryAccessOnly: number;

    @Column({field: 'redirect_to_duplicate', type: DataType.TINYINT, defaultValue: 1})
    redirectToDuplicate: number;

    @Column({field: 'enable_pause_production_by_view', type: DataType.TINYINT, defaultValue: 0})
    enablePauseProductionByView: number;

    @Column({field: 'login_access_apps', type: DataType.TINYINT, defaultValue: 1})
    loginAccessApps: number;

    @Column({field: 'enable_tag_zone', type: DataType.TINYINT, defaultValue: 0})
    enableTagZone: number;
}
