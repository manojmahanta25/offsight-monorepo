import {Table, Column, Model, DataType, ForeignKey} from 'sequelize-typescript';
import { ViewModel } from './view.model';
import { ClientModel, UserGroupModel } from '@app/model';

@Table({
  tableName: 'view_to_clientgroup',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ViewToGroupModel extends Model<ViewToGroupModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => ViewModel)
  @Column({ type: DataType.BIGINT })
  view_id: number;

  @ForeignKey(() => UserGroupModel)
  @Column({ type: DataType.BIGINT})
  user_group_id: number;

  @ForeignKey(() => ClientModel)
  @Column({  type: DataType.BIGINT })
  client_id: number;

}
