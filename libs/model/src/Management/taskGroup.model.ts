import { Table, Column, Model, DataType, Default, BeforeCreate, ForeignKey, HasMany } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { ClientModel } from '../Client/client.model';
import { BadRequestException } from '@nestjs/common';
import { TaskTypeModel } from './taskType.model';
import { TaskGroupToClientGroupModel } from './taskGroupToClientGroup.model';

@Table({
  tableName: 'task_groups',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
})

export class TaskGroupModel extends Model<TaskGroupModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  task_group_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ClientModel, key: 'client_id' },
  })
  client_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  task_group_name: string;

  @Column({
    type: DataType.BIGINT,
    references: { model: TaskTypeModel , key: 'task_type_id' },
    allowNull: true
  })
  task_type_id: number;

  @Default(false)
  @Column({ type: DataType.TINYINT, allowNull: true })
  autofill_task_form: boolean;

  @Default(false)
  @Column({ type: DataType.TINYINT, allowNull: true })
  move_to_zone: boolean;

  @Default(false)
  @Column({ type: DataType.TINYINT, allowNull: true })
  skip_percentage: boolean;

  @Default(false)
  @Column({ type: DataType.STRING, allowNull: true })
  task_group_color: string;
  
  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  is_active: boolean;

  @Column({ type: DataType.BIGINT, allowNull: true })
  task_group_order: number;

  @BeforeCreate
  static async InsertOrdering(taskGroup: TaskGroupModel) {
    const result = await TaskGroupModel.findOne({
      where: {
        client_id: taskGroup.client_id,
        task_group_name: {
          [Op.like]: `%${taskGroup.task_group_name}%`,
        },
      },
    });
    if (result) throw new BadRequestException("Task Group name already exist");

    const last_task_group_order: number | null = await TaskGroupModel.max(
      'task_group_order',
      { where: { client_id: taskGroup.client_id } },
    );
    taskGroup.task_group_order = !last_task_group_order ? 1 : last_task_group_order + 1;
  }

  @HasMany(()=> TaskGroupToClientGroupModel)
  group_access_settings:TaskGroupToClientGroupModel[];

}

