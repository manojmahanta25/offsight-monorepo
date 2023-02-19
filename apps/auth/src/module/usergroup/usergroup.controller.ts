import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors} from '@nestjs/common';
import {UserGroupService} from "./user-group.service";
import {AuthGuard} from "../../middleware/authguard";
import {ManagementAccessGuard} from "@app/common/gaurd/management-access.guard";
import {Request} from "express";
import {JwtPayloadInterface} from "@app/common/interfaces/jwt-payload.interface";
import {
    UserGroupMinimalDto,
    UserGroupUpdateAllDto,
} from "./user-group.dto";
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {TransformResponseInterceptor} from "@app/common";

@ApiTags('User Group')
@UseGuards(AuthGuard, ManagementAccessGuard)
@Controller('usergroup')
@UseInterceptors(TransformResponseInterceptor)
export class UserGroupController {
    constructor(private readonly userGroupService: UserGroupService) {
    }


    @Get()
    getUserSUserGroup(
        @Req() req:Request
    ) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        const userGroupId = decodeToken.userGroupId;
        return this.userGroupService.getUserGroup(clientId, userGroupId);
    }

    @Get('all')
    listUserGroup(@Req() req:Request ) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        return this.userGroupService.listUserGroup(clientId);
    }

    @Get(':userGroupId')
    getUserGroup(
        @Req() req:Request ,
        @Param('userGroupId') userGroupId: number
    ) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        return this.userGroupService.getUserGroup(clientId, userGroupId);
    }

    @ApiBody({type: UserGroupMinimalDto})
    @Post('create')
    createUserGroup(
        @Req() req:Request ,
        @Body() userGroupMinimalDto: UserGroupMinimalDto
    ) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        return this.userGroupService.createUserGroup(clientId, userGroupMinimalDto);
    }

    @ApiBody({type: UserGroupUpdateAllDto})
    @Put(':userGroupId')
    updateUserGroup(
        @Req() req:Request ,
        @Param('userGroupId') userGroupId: number,
        @Body() userGroupDto: UserGroupUpdateAllDto
    ) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        return this.userGroupService.updateUserGroup(clientId, userGroupId, userGroupDto);
    }

    // @ApiBody({type: UserGroupSettingDto})
    // @Put(':userGroupId/settings')
    // updateUserGroupSettings(
    //     @Req() req:Request ,
    //     @Param('userGroupId') userGroupId: number,
    //     @Body() userGroupSettingDto: UserGroupSettingDto
    // ) {
    //     const decodeToken = req['decodeToken'] as JwtPayloadInterface;
    //     const clientId = decodeToken.clientId;
    //     return this.userGroupService.updateUserGroup(clientId, userGroupId, userGroupSettingDto);
    // }
    //
    // @ApiBody({type: UserGroupAlertDto})
    // @Put(':userGroupId/alerts')
    // updateUserGroupAlerts(
    //     @Req() req:Request ,
    //     @Param('userGroupId') userGroupId: number,
    //     @Body() userGroupAlertDto: UserGroupAlertDto
    // ) {
    //     const decodeToken = req['decodeToken'] as JwtPayloadInterface;
    //     const clientId = decodeToken.clientId;
    //     return this.userGroupService.updateUserGroup(clientId, userGroupId, userGroupAlertDto);
    // }
    //
    // @ApiBody({type: UserGroupLoginAccessDto})
    // @Put(':userGroupId/login-access')
    // updateUserGroupLoginAccess(
    //     @Req() req:Request ,
    //     @Param('userGroupId') userGroupId: number,
    //     @Body() userGroupLoginAccessDto:UserGroupLoginAccessDto
    // ) {
    //     const decodeToken = req['decodeToken'] as JwtPayloadInterface;
    //     const clientId = decodeToken.clientId;
    //     return this.userGroupService.updateUserGroup(clientId, userGroupId, userGroupLoginAccessDto);
    // }

    @Delete(':userGroupId')
    deleteUserGroup(
        @Req() req:Request ,
        @Param('userGroupId') userGroupId: number
    ) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        return this.userGroupService.deleteUserGroup(clientId, userGroupId);
    }

    @Get('/download')
    downloadUserGroup(@Req() req:Request) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        return this.userGroupService.downloadExcelUserGroup(clientId);
    }

    @Post('/set-order')
    setUserGroupOrder(@Req() req:Request, @Body() body: UserGroupMinimalDto[]) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        return this.userGroupService.setOrderUserGroup(clientId, body);
    }
}

/*
* async function mappUserGrouptoProductTypeGroup(tempExcelTable, client_id) {
    var sql = 'INSERT INTO actv_product_type_group_user_group_mapping SELECT NULL, ptg.client_product_type_group_id, aptm.actv_product_type_id, ug.client_user_group_id, 1, ug.client_id, NOW(), NOW() FROM actv_client_user_groups ug INNER JOIN ' + tempExcelTable + ' ptex ON ptex.client_id = ug.client_id AND ptex.client_user_group_name = ug.client_user_group_name AND (ptex.client_user_group_id IS NULL OR ptex.client_user_group_is_active = 0) INNER JOIN actv_product_type_group ptg ON ug.client_id = ptg.client_id AND ptg.product_type_group_is_active = 1 AND ptg.product_type_group_order != -1 INNER JOIN actv_product_type_master aptm ON aptm.actv_product_type_group_id = ptg.client_product_type_group_id AND aptm.client_product_type_is_active = 1 WHERE ug.client_user_group_is_active = 1;UPDATE actv_client_users u INNER JOIN actv_client_user_groups ug ON u.client_user_group_id = ug.client_user_group_id SET u.zone_location_setting = IF(ug.zone_location_popup IN (0,1),ug.zone_location_popup,u.zone_location_setting),u.is_show_users_tagged_in_live_screen = IF(ug.show_users_tagged_in_live_screen IN (0,1), ug.show_users_tagged_in_live_screen,u.is_show_users_tagged_in_live_screen), u.is_send_to_live_once_all_task_done_setting = IF(ug.is_send_to_live_once_all_task_done_setting IN (0,1), ug.is_send_to_live_once_all_task_done_setting,u.is_send_to_live_once_all_task_done_setting), u.is_stay_on_completed_task = IF(ug.is_stay_on_completed_task IN (0,1), ug.is_stay_on_completed_task,u.is_stay_on_completed_task), u.move_to_next_form_feature = IF(ug.move_to_next_form_feature IN (0,1), ug.move_to_next_form_feature,u.move_to_next_form_feature), u.is_production_order_name_display = IF(ug.is_production_order_name_display IN (0,1), ug.is_production_order_name_display,u.is_production_order_name_display), u.show_timer_for_task_types = IF(ug.show_timer_for_task_types IN (0,1), ug.show_timer_for_task_types,u.show_timer_for_task_types) WHERE ug.client_id=?;';
    var result = await db_class_v1.queryValues(sql, [client_id], 'MGT_SQL_mappUserGrouptoProductTypeGroup');
    dropTable(tempExcelTable);
}

async function updateUserGroupHideDuplicateTask(client_id) {

    var sql = 'UPDATE actv_client_users u INNER JOIN actv_client_user_groups ug ON ug.client_user_group_id = u.client_user_group_id SET u.hide_duplicate_task = ug.hide_task WHERE u.client_id = ' + client_id + ' AND u.client_user_is_active = 1 AND ug.client_user_group_is_active = 1;';
    var result = await db_class_v1.queryValues(sql, [client_id], 'MGT_SQL_updateUserGroupHideDuplicateTask');
    // }
}*/

