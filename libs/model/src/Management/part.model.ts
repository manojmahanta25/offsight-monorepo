import { Table, Column, Model, DataType, Default, BeforeCreate } from "sequelize-typescript";
import { Op } from "sequelize";
import { ClientModel } from "../Client/client.model";
import { BadRequestException } from "@nestjs/common";
import { TagGroupModel } from "./tagGroup.model";
import { ProductTypeModel } from "./productType.model";

@Table({
  tableName: "parts",
  timestamps: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
})
export class PartModel extends Model<PartModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  part_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: TagGroupModel, key: "part_group_id" },
  })
  part_group_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ClientModel, key: "client_id" },
  })
  client_id: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    references: { model: ProductTypeModel, key: "product_type_id" },
  })
  product_type_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  part_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  part_barcode_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  supplier_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  comments: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  quantity: number;

  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  is_active: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  part_order: number;

  @BeforeCreate
  static async InsertOrdering(part: PartModel) {
    const result = await PartModel.findOne({
      where: {
        client_id: part.client_id,
        part_name: {
          [Op.like]: `%${part.part_name}%`,
        },
      },
    });
    if (result) throw new BadRequestException("Part name already exist");
    const last_port_order: number | null = await PartModel.max("part_order", { where: { client_id: part.client_id } });
    part.part_order = !last_port_order ? 1 : last_port_order + 1;
  }
}
