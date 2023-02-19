import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  BeforeCreate
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { ClientModel } from './../Client/client.model';
import { BadRequestException } from '@nestjs/common';

@Table({
  tableName: 'product_type_groups',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
})
export class ProductTypeGroupModel extends Model<ProductTypeGroupModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  product_type_group_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ClientModel, key: 'client_id' },
  })
  client_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  product_type_group_name: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  product_type_group_order: number;

  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  is_active: boolean;
  
  @Default(false)
  @Column({ type: DataType.TINYINT, allowNull: false })
  is_auto_end: boolean;
  
  @Default(false)
  @Column({ type: DataType.BIGINT, allowNull: false })
  auto_end_by_user: number;

  @BeforeCreate
  static async InsertOrdering(productTypeGroup: ProductTypeGroupModel) {
    const result = await ProductTypeGroupModel.findOne({
      where: {
        client_id: productTypeGroup.client_id,
        product_type_group_name: {
          [Op.like]: `%${productTypeGroup.product_type_group_name}%`,
        },
      },
    });
    if (result) throw new BadRequestException("Prodct Type Group name already exist")
    const last_ptg_order: number | null = await ProductTypeGroupModel.max(
      'product_type_group_order',
      { where: { client_id: productTypeGroup.client_id } },
    );
    productTypeGroup.product_type_group_order = !last_ptg_order ? 1 : last_ptg_order + 1;
  }
}
