import { Table, Column, Model, DataType, Default, BeforeCreate } from "sequelize-typescript";
import { Op } from "sequelize";
import { ClientModel } from "../Client/client.model";
import { BadRequestException } from "@nestjs/common";
import { TagGroupModel } from "./tagGroup.model";

@Table({
  tableName: "tags",
  timestamps: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
})
export class TagModel extends Model<TagModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  tag_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: TagGroupModel, key: "tag_group_id" },
  })
  tag_group_id: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: ClientModel, key: "client_id" },
  })
  client_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  tag_title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  tag_description: string;

  @Default(true)
  @Column({ type: DataType.TINYINT, allowNull: false })
  is_active: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  tag_order: number;

  @BeforeCreate
  static async InsertOrdering(tag: TagModel) {
    const result = await TagModel.findOne({
      where: {
        client_id: tag.client_id,
        tag_title: {
          [Op.like]: `%${tag.tag_title}%`,
        },
      },
    });
    if (result) throw new BadRequestException("Tag name already exist");
    const last_pt_order: number | null = await TagModel.max("tag_order", { where: { client_id: tag.client_id } });
    tag.tag_order = !last_pt_order ? 1 : last_pt_order + 1;
  }
}
