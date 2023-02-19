import { Injectable, Inject } from "@nestjs/common";
import { TaskTypeModel } from "@app/model";

@Injectable()
export class TaskTypeService {
  constructor(@Inject("TaskTypeModelRepository") private taskTypeModel: typeof TaskTypeModel) {}

  async getAll(client_id: number): Promise<any> {
    return this.taskTypeModel.findAll({
      where: { is_active: true, client_id },
    });
  }

  async createTaskType(client_id: number, taskTypeDto): Promise<any> {
    return await this.taskTypeModel.create({
      client_id: client_id,
      task_type_name: taskTypeDto.task_type_name,
    });
  }

  async updateTaskType({ task_type_id, client_id }, taskTypeDto): Promise<any> {
    await this.taskTypeModel.update(
      {
        task_type_name: taskTypeDto.task_type_name,
      },
      { where: { task_type_id, client_id } },
    );
    return this.taskTypeModel.findByPk(task_type_id);
  }

  async deleteTaskType({ task_type_id, client_id }): Promise<any> {
    return "NEED TO Place condition for delete";
    // return await this.taskTypeModel.update({ is_active: false }, { where: { task_type_id, client_id } });
  }

  async setTaskTypeOrder(tagOrder, client_id): Promise<any> {
    for (let index = 0; index < tagOrder.length; index++) {
      let element = tagOrder[index];
      element["task_type_order"] = index + 1;
    }
    await this.taskTypeModel.bulkCreate(tagOrder, {
      updateOnDuplicate: ["task_type_order"],
    });
    return this.getAll(client_id);
  }
}
