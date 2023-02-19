import { Table, Column, Model, DataType, Default, BeforeCreate } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { ClientModel } from '../Client/client.model';
import { BadRequestException } from '@nestjs/common';
import { ProductTypeGroupModel } from './productTypeGroup.model';
import { ZoneModel } from './zone.model';

@Table({
  tableName: 'product_types',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
})
export class ProductTypeModel extends Model<ProductTypeModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  product_type_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ProductTypeModel, key: 'product_type_id' },
  })
  parent_product_type_id:number;
  
  @Column({
    type: DataType.BIGINT,
    references: { model: ProductTypeGroupModel, key: 'product_type_group_id' },
  })
  product_type_group_id:number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ClientModel, key: 'client_id' },
  })
  client_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  product_type_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  client_device_image_url:string;

  @Column({ type: DataType.STRING, allowNull: true })
  client_device_image_url_s3:string; 
  
  @Column({
    type: DataType.BIGINT,
    references: { model: ZoneModel, key: 'client_zone_id' },
  })
  product_type_default_zone_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  product_type_order: number;

  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  product_type_is_active: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  quantity_count_enable_by: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  untag_enable_by: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  is_quantity_count_enable: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  is_untag_users_between_zones: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  track_production_time: number;

  @BeforeCreate
  static async InsertOrdering(productType: ProductTypeModel) {
    const result = await ProductTypeModel.findOne({
      where: {
        client_id: productType.client_id,
        product_type_name: {
          [Op.like]: `%${productType.product_type_name}%`,
        },
      },
    });
    if (result) throw new BadRequestException("Prodct Type name already exist")
    const last_pt_order: number | null = await ProductTypeModel.max(
      'product_type_order',
      { where: { client_id: productType.client_id } },
    );
    productType.product_type_order = !last_pt_order ? 1 : last_pt_order + 1;
  }
}

