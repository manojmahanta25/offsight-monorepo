import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {UserClientPivotModel} from "./user-client-pivot.model";

@Table({tableName: 'user_config', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at'})
export class UserConfigModel extends Model<UserConfigModel> {

    @Column({field: 'id', type: DataType.BIGINT, primaryKey: true, autoIncrement: true})
    id: number;

    @ForeignKey(() => UserClientPivotModel)
    @Column({field: 'client_user_pivot_id', type: DataType.BIGINT, unique: true, references: {model: UserClientPivotModel, key: 'id'} })
    clientUserPivotId: number;

    @Column({field: 'default_feed_view_id', type: DataType.INTEGER})
    defaultFeedViewId: number;

    @Column({field: 'view_all_sub_view_id', type: DataType.INTEGER})
    viewAllSubViewId: number;

    @Column({field: 'zone_location_setting', type: DataType.TINYINT})
    zoneLocationSetting: boolean;

    @Column({field: 'cost_per_hour', type: DataType.STRING})
    costPerHour: string;

    @Column({field: 'search_preference', type: DataType.STRING})
    searchPreference: string;

    @Column({field: 'search_preference_live_screen', type: DataType.STRING})
    searchPreferenceLiveScreen: string;

    @Column({field: 'search_preference_live_pt', type: DataType.STRING})
    searchPreferenceLivePt: string;

    @Column({field: 'is_production_order_name_display', type: DataType.TINYINT})
    isProductionOrderNameDisplay: boolean;

    @Column({field: 'is_send_to_live_once_all_task_done_setting', type: DataType.TINYINT})
    isSendToLiveOnceAllTaskDoneSetting: boolean;

    @Column({field: 'is_sort_products_by_end_date', type: DataType.TINYINT})
    isSortProductsByEndDate: boolean;

    @Column({field: 'show_time_left_instead_of_zone_time', type: DataType.TINYINT})
    showTimeLeftInsteadOfZoneTime: boolean;

    @Column({field: 'actv_user_analytics_select_view', type: DataType.INTEGER})
    actvUserAnalyticsSelectView: number;

    @Column({field: 'collapse_all_task_groups', type: DataType.TINYINT})
    collapseAllTaskGroups: boolean;

    @Column({field: 'is_show_users_tagged_in_live_screen', type: DataType.TINYINT})
    isShowUsersTaggedInLiveScreen: boolean;

    @Column({field: 'is_stay_on_completed_task', type: DataType.TINYINT})
    isStayOnCompletedTask: boolean;

    @Column({field: 'is_auto_collapse_all_views', type: DataType.TINYINT})
    isAutoCollapseAllViews: boolean;

    @Column({field: 'show_timer_for_task_types', type: DataType.TINYINT})
    showTimerForTaskTypes: boolean;

    @Column({field: 'show_zone_time_target', type: DataType.TINYINT})
    showZoneTimeTarget: boolean;

    @Column({field: 'hide_duplicate_task', type: DataType.TINYINT})
    hideDuplicateTask: boolean;

    @Column({field: 'show_no_of_products_in_zone', type: DataType.TINYINT})
    showNoOfProductsInZone: boolean;

    @Column({field: 'history_selected_date_range', type: DataType.STRING})
    historySelectedDateRange: string;

    @Column({field: 'client_user_timezone_abbr', type: DataType.STRING})
    clientUserTimezoneAbbr: string;

    @Column({field: 'user_system_timezone_abbr', type: DataType.STRING})
    userSystemTimezoneAbbr: string;

    @Column({field: 'move_to_next_form_feature', type: DataType.TINYINT})
    moveToNextFormFeature: boolean;

    @Column({field: 'invert_zone_box_title', type: DataType.TINYINT})
    invertZoneBoxTitle: boolean;

    @Column({field: 'live_all_products_export_filter_view_id', type: DataType.INTEGER})
    liveAllProductsExportFilterViewId: number;

    @Column({field: 'live_single_product_export_filter_view_id', type: DataType.INTEGER})
    liveSingleProductExportFilterViewId: number;

    @Column({field: 'history_product_export_filter_view_id', type: DataType.INTEGER})
    historyProductExportFilterViewId: number;

    @Column({field: 'reporting_export_filter_view_id', type: DataType.INTEGER})
    reportingExportFilterViewId: number;

    @Column({field: 'gantt_filter_view_id', type: DataType.INTEGER})
    ganttFilterViewId: number;

    @Column({field: 'alert_filters', type: DataType.STRING})
    alertFilters: string;

    @Column({field: 'measurement', type: DataType.STRING})
    measurement: string;

    @Column({field: 'start_selected_date_range', type: DataType.TEXT})
    startSelectedDateRange: string;

    @Column({field: 'start_selected_date_target', type: DataType.TEXT})
    startSelectedDateTarget: string;

    @Column({field: 'hide_normal_task_icon', type: DataType.TINYINT})
    hideNormalTaskIcon: boolean;

    @Column({field: 'user_2fa_enable', type: DataType.INTEGER})
    user2faEnable: number;

    @Column({field: 'user_sid', type: DataType.STRING})
    userSid: string;

    @Column({field: 'user_id', type: DataType.STRING})
    userEntities: string;

    @BelongsTo(() => UserClientPivotModel)
    user: UserClientPivotModel;

}