import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { TaskGroupModel, TaskGroupToClientGroupModel, UserGroupModel } from "@app/model";
import { Op } from "sequelize";

@Injectable()
export class TaskGroupService {
  constructor(
    @Inject("TaskGroupModelRepository") private taskGroupModel: typeof TaskGroupModel,
    @Inject("UserGroupModelRepository") private userGroupModel: typeof UserGroupModel,
    @Inject("TaskGroupToClientGroupModelRepository") private taskGroupToClientGroupModel: typeof TaskGroupToClientGroupModel,
  ) {}

  async getAll(client_id: number): Promise<any> {
    return this.taskGroupModel.findAll({
      where: { is_active: true, client_id },
    });
  }

  async createTaskGroup(client_id: number, taskGroupDto): Promise<any> {
    if (!taskGroupDto.task_type_id && taskGroupDto.autofill_task_form) throw new BadRequestException("Autofill Task Form can only be applied to Custom Task Types.");

    const response = await this.taskGroupModel.create({
      client_id: client_id,
      task_group_name: taskGroupDto.task_group_name,
      task_type_id: taskGroupDto.task_type_id,
      autofill_task_form: taskGroupDto.autofill_task_form,
      move_to_zone: taskGroupDto.move_to_zone,
      skip_percentage: taskGroupDto.skip_percentage,
    });

    if (response) {
      const userGroups = await this.userGroupModel.findAll({ attributes: ["id"], where: { clientId: client_id, clientUserGroupIsActive: true } });
      if (userGroups && userGroups.length) {
        const data = [];
        userGroups.forEach(item => {
          data.push({
            task_group_id: response.task_group_id,
            user_group_id: item.id,
            client_id,
            is_alert_enabled: 1,
          });
        });
        await this.taskGroupToClientGroupModel.bulkCreate(data);
      }
    }
    return response;
  }

  async updateTaskGroup({ task_group_id, client_id }, taskGroupDto): Promise<any> {
    if (!taskGroupDto.task_type_id && taskGroupDto.autofill_task_form) throw new BadRequestException("Autofill Task Form can only be applied to Custom Task Types.");
    await this.taskGroupModel.update(
      {
        task_group_name: taskGroupDto.task_group_name,
        task_type_id: taskGroupDto.task_type_id,
        autofill_task_form: taskGroupDto.autofill_task_form,
        move_to_zone: taskGroupDto.move_to_zone,
        skip_percentage: taskGroupDto.skip_percentage,
      },
      { where: { task_group_id, client_id } },
    );
    return this.taskGroupModel.findByPk(task_group_id);
  }

  async setTaskGroupOrder(taskGroupOrder, client_id): Promise<any> {
    for (let index = 0; index < taskGroupOrder.length; index++) {
      let element = taskGroupOrder[index];
      element["task_group_order"] = index + 1;
    }
    await this.taskGroupModel.bulkCreate(taskGroupOrder, {
      updateOnDuplicate: ["task_group_order"],
    });
    return this.getAll(client_id);
  }

  async getTaskGroupUserAccess(client_id): Promise<any> {
    const [groups, result] = await Promise.all([
      this.userGroupModel.findAll({ attributes: ["id", "userGroupName"], where: { clientId: client_id, clientUserGroupIsActive: true } }),
      this.taskGroupModel.findAll({
        where: { client_id },
        include: [{ model: TaskGroupToClientGroupModel, attributes: ["user_group_id", "is_alert_enabled"] }],
        attributes: ["task_group_id", "task_group_name", "group_access_settings.*"],
      }),
    ]);
    return { task_groups: result, user_groups: groups };
  }

  async setTaskGroupUserAccess(userAccessTaskGroupArrayDto, client_id: number): Promise<any> {
    const taskGroupAccess = userAccessTaskGroupArrayDto.taskGroupAccessMapping;
    const [userGroups, taskGroups, taskGroupAccessData] = await Promise.all([
      this.userGroupModel.findAll({ attributes: ["id"], raw: true, where: { clientId: client_id, clientUserGroupIsActive: true } }),
      this.taskGroupModel.findAll({ attributes: ["task_group_id"], raw: true, where: { is_active: true, client_id } }),
      this.taskGroupToClientGroupModel.findAll({ attributes: ["id", "task_group_id", "user_group_id", "is_alert_enabled"], raw: true, where: { client_id } }),
    ]);

    const [userGroupIds, postUserGroupIds, taskGroupIds, postTaskGroupIds] = await Promise.all([
      userGroups.reduce(function (acc, itm) {
        acc.push(itm.id);
        return acc;
      }, []),
      taskGroupAccess.reduce(function (acc, itm) {
        acc.push(itm.user_group_id);
        return acc;
      }, []),
      taskGroups.reduce(function (acc, itm) {
        acc.push(itm.task_group_id);
        return acc;
      }, []),
      taskGroupAccess.reduce(function (acc, itm) {
        acc.push(itm.task_group_id);
        return acc;
      }, []),
    ]);

    const userGp = postUserGroupIds.filter(el => userGroupIds.includes(el));
    const taskGp = postTaskGroupIds.filter(el => taskGroupIds.includes(el));

    if (!userGp.length) throw new BadRequestException("Unable to find User Group");
    if (!taskGp.length) throw new BadRequestException("Unable to find Task Group");

    const deleteIds = await taskGroupAccessData.reduce(function (acc, itm) {
      const item = taskGroupAccess.filter(el => el.task_group_id == itm.task_group_id && el.user_group_id == itm.user_group_id);
      if (!item.length) acc.push(itm.id);
      return acc;
    }, []);

    await this.taskGroupToClientGroupModel.destroy({
      where: { id: { [Op.in]: deleteIds } },
    });

    const requets = await taskGroupAccess.map(item =>
      this.taskGroupToClientGroupModel.update(
        { is_alert_enabled: item.is_alert_enabled },
        {
          where: {
            task_group_id: item.task_group_id,
            user_group_id: item.user_group_id,
          },
        },
      ),
    );

    const response = await Promise.all(requets);
    return response;
  }

  // async deleteTaskGroup({ task_group_id }){
  //   const taskGroup = await this.getTaskGroupByID(task_group_id);
  //   return await taskGroup.destroy();
  // }

  async getTaskGroupByID(task_group_id: number) {
    const tg = await this.taskGroupModel.findByPk(task_group_id);
    if (!tg) throw new BadRequestException("Unable to find Task Group");
    return tg;
  }
}
