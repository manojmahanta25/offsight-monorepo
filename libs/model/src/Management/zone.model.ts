import { BadRequestException } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  BeforeCreate,
} from 'sequelize-typescript';
import { ClientModel } from '@app/model/Client';

export enum zoneType {
  MAIN = 'MAIN',
  REWORK = 'REWORK',
}


@Table({
  tableName: 'zones',
  timestamps: true,
  createdAt: 'client_zone_date_added',
  updatedAt: 'client_zone_date_updated',
  deletedAt: 'client_zone_date_deleated',
})
export class ZoneModel extends Model<ZoneModel> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  client_zone_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ClientModel, key: 'client_id' },
  })
  client_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  client_zone_name: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  client_zone_sequence_number: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  client_zone_order: number;

  @Column({ type: DataType.STRING, allowNull: true })
  client_zone_pdf_url: string;

  @Column({ type: DataType.STRING, allowNull: true })
  client_zone_pdf_url_s3: string;

  @Default(zoneType.MAIN)
  @Column({ type: DataType.ENUM(zoneType.MAIN, zoneType.REWORK) })
  client_zone_type: zoneType;

  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  client_zone_is_active: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  client_zone_barcode_id: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  position_x: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  position_y: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  height: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  width: number;

  @Column({ type: DataType.STRING, allowNull: true })
  client_zone_color: string;

  @Column({ type: DataType.FLOAT, allowNull: true })
  client_zone_text_size: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  view_all_position_x: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  view_all_position_y: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  view_all_height: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  view_all_width: number;

  @Column({ type: DataType.STRING, allowNull: true })
  view_all_client_zone_color: string;

  @Column({ type: DataType.FLOAT, allowNull: true })
  view_all_client_zone_text_size: number ;
  
  @BeforeCreate
  static async InsertOrdering(zone: ZoneModel) {
    const result = await ZoneModel.findOne({
      where: {
        client_id: zone.client_id,
        client_zone_name: {
          [Op.like]: `%${zone.client_zone_name}%`,
        },
      },
    });
    if (result) throw new BadRequestException("Zone name already exist")

    const last_client_zone_order: number | null = await ZoneModel.max(
      'client_zone_order',
      { where: { client_id: zone.client_id } },
    );
    zone.client_zone_order = !last_client_zone_order ? 1 : last_client_zone_order + 1;
  }
}
