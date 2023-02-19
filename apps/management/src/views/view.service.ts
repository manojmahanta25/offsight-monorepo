import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { UserGroupModel, ViewModel, ViewToGroupModel, ZoneToViewModel } from "@app/model";
import { Op } from "sequelize";
import { ExcelService } from "@app/common/excel/excel.service";
import { ViewUserGroupSetting } from "./interfaces/view.interfaces";
import { ViewOrderDto } from "./dto/create-view.dto";

@Injectable()
export class ViewService {
  constructor(
    @Inject("ViewModelRepository") private viewModel: typeof ViewModel,
    @Inject("ViewToGroupModelRepository") private viewToGroupModel: typeof ViewToGroupModel,
    @Inject("UserGroupModelRepository") private userGroupModel: typeof UserGroupModel,
    @Inject("ZoneToViewModelRepository") private zoneToViewModel: typeof ZoneToViewModel,
    private excelService: ExcelService,
  ) {}

  async getAll(client_id: number): Promise<ViewModel[]> {
    return this.viewModel.findAll({
      order: [["feed_view_order", "ASC"]],
      where: { feed_view_is_active: true, client_id },
    });
  }

  async getAllUserGroupSetting(client_id: number): Promise<ViewUserGroupSetting> {
    const [groups, result] = await Promise.all([
      this.userGroupModel.findAll({ attributes: ["id", "userGroupName"], where: { clientId: client_id, clientUserGroupIsActive: true } }),
      this.viewToGroupModel.findAll({ where: { client_id } }),
    ]);
    return { group_settings: result, user_groups: groups };
  }

  async createView(client_id: number, user_group_id: number, createViewDto): Promise<ViewModel> {
    const response = await this.viewModel.create({
      client_id: client_id,
      feed_view_name: createViewDto.feed_view_name,
    });

    if (response) {
      const userGroups = await this.userGroupModel.findAll({ attributes: ["id"], where: { clientId: client_id, clientUserGroupIsActive: true } });
      if (userGroups && userGroups.length) {
        const data = [];
        userGroups.forEach(item => {
          data.push({
            view_id: response.feed_view_id,
            user_group_id: item.id,
            client_id,
          });
        });
        await this.viewToGroupModel.bulkCreate(data);
      }
    }
    return response;
  }

  async updateView({ feed_view_id, client_id }, updateViewDto): Promise<ViewModel> {
    const result = await ViewModel.findOne({
      where: {
        client_id: client_id,
        feed_view_name: {
          [Op.like]: `%${updateViewDto.feed_view_name}%`,
        },
        feed_view_id: { [Op.not]: feed_view_id },
      },
    });
    if (result) throw new BadRequestException("Feed view name already exist");

    await this.viewModel.update({ feed_view_name: updateViewDto.feed_view_name }, { where: { feed_view_id, client_id } });
    return this.viewModel.findByPk(feed_view_id);
  }

  async updateViewGroupAccess({ feed_view_id, client_id }, groupIds: number[]): Promise<any> {
    const result = await this.viewToGroupModel.destroy({
      where: {
        view_id: feed_view_id,
        client_id,
        user_group_id: {
          [Op.notIn]: groupIds,
        },
      },
    });

    return result;
  }

  async deleteView({ feed_view_id, client_id }): Promise<number[]> {
    const zoneResposne = await this.zoneToViewModel.findAll({ where: { feed_view_id } });
    if (zoneResposne && zoneResposne.length) throw new BadRequestException("View is associated with zone can not delete.");
    return await this.viewModel.update({ feed_view_is_active: false }, { where: { feed_view_id, client_id } });
  }

  async setViewOrder(viewOrder:ViewOrderDto[], client_id: number): Promise<ViewModel[]> {
    for (let index = 0; index < viewOrder.length; index++) {
      let element = viewOrder[index];
      element["feed_view_order"] = index + 1;
    }

    await this.viewModel.bulkCreate(viewOrder, {
      updateOnDuplicate: ["feed_view_order"],
    });

    return this.getAll(client_id);
  }

  async downoadExcel(client_id: number): Promise<Buffer> {
    const headers = [
      { key: "feed_view_name", header: "View Name" },
      { key: "feed_view_order", header: "View Order" },
    ];
    const options = {};
    const response = await this.getAll(client_id);
    return (await this.excelService.downloadExcel(response, headers, options)) as Buffer;
  }
}
