import { Table, Column, Model, DataType, Default, BeforeCreate, ForeignKey, BelongsTo } from "sequelize-typescript";
import { ClientModel } from "./../Client/client.model";
import { ProductTypeModel } from "./productType.model";
import { ProductTypeGroupModel } from "./productTypeGroup.model";
import { UserGroupModel } from "../User";

@Table({
  tableName: "product_type_group_user_group_mapping",
  timestamps: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
})
export class ProductTypeGroupUserGroupMappingModel extends Model<ProductTypeGroupUserGroupMappingModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  product_type_group_user_group_map_id: number;

  @ForeignKey(() => ClientModel)
  @Column({ type: DataType.BIGINT })
  client_id: number;

  @ForeignKey(() => ProductTypeGroupModel)
  @Column({ type: DataType.BIGINT })
  product_type_group_id: number;

  @ForeignKey(() => ProductTypeModel)
  @Column({ type: DataType.BIGINT })
  product_type_id: number;

  @ForeignKey(() => UserGroupModel)
  @Column({ type: DataType.BIGINT })
  user_group_id: number;

  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  enable_alerts: boolean;

  @BelongsTo(() => ProductTypeGroupModel)
  product_type_groups: ProductTypeGroupModel;
  @BelongsTo(() => ProductTypeModel)
  product_type: ProductTypeModel;
}
