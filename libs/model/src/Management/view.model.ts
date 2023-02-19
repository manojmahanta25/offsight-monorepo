import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  BeforeCreate,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { ClientModel } from './../Client/client.model';
import { BadRequestException } from '@nestjs/common';

@Table({
  tableName: 'views',
  timestamps: true,
  createdAt: 'feed_view_date_added',
  updatedAt: 'feed_view_date_updated',
})
export class ViewModel extends Model<ViewModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  feed_view_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ClientModel, key: 'client_id' },
  })
  client_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  feed_view_name: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  feed_view_order: number;

  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  feed_view_is_active: boolean;

  @BeforeCreate
  static async InsertOrdering(view: ViewModel) {
    const result = await ViewModel.findOne({
      where: {
        client_id: view.client_id,
        feed_view_name: {
          [Op.like]: `%${view.feed_view_name}%`,
        },
      },
    });
    if (result) throw new BadRequestException("Feed view name already exist")
    const last_feed_view_order: number | null = await ViewModel.max(
      'feed_view_order',
      { where: { client_id: view.client_id } },
    );
    view.feed_view_order = !last_feed_view_order ? 1 : last_feed_view_order + 1;
  }

}
