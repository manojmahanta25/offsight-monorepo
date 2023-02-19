import { Table, Column, Model, DataType, Default, BeforeCreate } from "sequelize-typescript";
import { Op } from "sequelize";
import { ClientModel } from "../Client/client.model";
import { BadRequestException } from "@nestjs/common";

@Table({
  tableName: "tag_groups",
  timestamps: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
})
export class TagGroupModel extends Model<TagGroupModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  tag_group_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ClientModel, key: "client_id" },
  })
  client_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  tag_group_name: string;

  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  is_active: boolean;

  @BeforeCreate
  static async InsertOrdering(tagGroup: TagGroupModel) {
    const result = await TagGroupModel.findOne({
      where: {
        client_id: tagGroup.client_id,
        tag_group_name: {
          [Op.like]: `%${tagGroup.tag_group_name}%`,
        },
      },
    });
    if (result) throw new BadRequestException("Tag Group name already exist");
  }
}
