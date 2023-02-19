import {Table, Column, Model, DataType, ForeignKey, Default, BelongsTo} from 'sequelize-typescript';
import { ClientModel, TaskGroupModel, UserGroupModel } from '@app/model';

@Table({
  tableName: 'taskgroup_to_clientgroup',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
})

export class TaskGroupToClientGroupModel extends Model<TaskGroupToClientGroupModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => TaskGroupModel)
  @Column({ type: DataType.BIGINT, references: {model: TaskGroupModel, key: 'task_group_id'} })
  task_group_id: number;

  @ForeignKey(() => UserGroupModel)
  @Column({ type: DataType.BIGINT})
  user_group_id: number;

  @ForeignKey(() => ClientModel)
  @Column({  type: DataType.BIGINT })
  client_id: number;

  @Default(1)
  @Column({  type: DataType.TINYINT })
  is_alert_enabled: number;

  @BelongsTo(()=>TaskGroupModel)
  task_groups: TaskGroupModel;

}