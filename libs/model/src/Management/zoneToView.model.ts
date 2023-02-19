import {
  Table,
  Column,
  Model,
  DataType, ForeignKey

} from 'sequelize-typescript';
import { ViewModel } from './view.model';
import { ZoneModel } from './zone.model';

@Table({
  tableName: 'zones_to_views'
})
export class ZoneToViewModel extends Model<ZoneToViewModel> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  actv_feed_views_zones_map_id: number;

  @ForeignKey(() => ZoneModel)
  @Column({
    type: DataType.BIGINT
  })
  client_zone_id: number;

  @ForeignKey(() => ViewModel)
  @Column({ 
    type: DataType.BIGINT
  })
  feed_view_id: number;

}
