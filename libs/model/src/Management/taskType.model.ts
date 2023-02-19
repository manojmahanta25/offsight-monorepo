import { Table, Column, Model, DataType, Default, BeforeCreate } from "sequelize-typescript";
import { Op } from "sequelize";
import { ClientModel } from "../Client/client.model";
import { BadRequestException } from "@nestjs/common";

@Table({
  tableName: "task_types",
  timestamps: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
})
export class TaskTypeModel extends Model<TaskTypeModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  task_type_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ClientModel, key: "client_id" },
  })
  client_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  task_type_name: string;

  @Column({ type: DataType.FLOAT, allowNull: true })
  target_time: number;

  @Column({ type: DataType.FLOAT, allowNull: true })
  late_time: number;

  @Column({ type: DataType.FLOAT, allowNull: true })
  very_late_time: number;

  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  is_active: boolean;

  @Column({ type: DataType.BIGINT, allowNull: false })
  task_type_order: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  created_by: number;

  @BeforeCreate
  static async InsertOrdering(taskType: TaskTypeModel) {
    const result = await TaskTypeModel.findOne({
      where: {
        client_id: taskType.client_id,
        task_type_name: {
          [Op.like]: `%${taskType.task_type_name}%`,
        },
      },
    });
    if (result) throw new BadRequestException("Task Type name already exist");

    const last_task_type_order: number | null = await TaskTypeModel.max("task_type_order", { where: { client_id: taskType.client_id } });
    taskType.task_type_order = !last_task_type_order ? 1 : last_task_type_order + 1;
  }
}
