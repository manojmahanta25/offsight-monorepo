import { Table, Column, Model, DataType, Default, BeforeCreate } from "sequelize-typescript";
import { Op } from "sequelize";
import { ClientModel } from "../Client/client.model";
import { BadRequestException } from "@nestjs/common";

@Table({
  tableName: "part_groups",
  timestamps: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
})
export class PartGroupModel extends Model<PartGroupModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  part_group_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ClientModel, key: "client_id" },
  })
  client_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  part_group_name: string;

  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  is_active: boolean;

  @BeforeCreate
  static async InsertOrdering(partGroup: PartGroupModel) {
    const result = await PartGroupModel.findOne({
      where: {
        client_id: partGroup.client_id,
        part_group_name: {
          [Op.like]: `%${partGroup.part_group_name}%`,
        },
      },
    });
    if (result) throw new BadRequestException("Part Group name already exist");
  }
}
