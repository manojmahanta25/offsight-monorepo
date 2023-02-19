import { Injectable, Inject } from "@nestjs/common";
import { TagGroupModel } from "@app/model";
import { QueryTypes } from "sequelize";

@Injectable()
export class TagGroupService {
  constructor(@Inject("TagGroupModelRepository") private tagGroupModel: typeof TagGroupModel) {}

  async getAll(client_id: number): Promise<any> {
    return this.tagGroupModel.findAll({
      where: { is_active: true, client_id },
    });
  }

  async createTagGroup(client_id: number, tagGroupDto): Promise<any> {
    return await this.tagGroupModel.create({
      client_id: client_id,
      tag_group_name: tagGroupDto.tag_group_name,
    });
  }

  async updateTagGroup({ tag_group_id, client_id }, tagGroupDto): Promise<any> {
    await this.tagGroupModel.update(
      {
        tag_group_name: tagGroupDto.tag_group_name,
      },
      { where: { tag_group_id, client_id } },
    );
    return this.tagGroupModel.findByPk(tag_group_id);
  }

  async deleteTagGroup({ tag_group_id, client_id }): Promise<any> {
    return "Need to check the condition to delete the Tag Group";
    // return await this.tagGroupModel.update(
    //   { tag_group_is_active: false },
    //   { where: { tag_group_id, client_id } },
    // );
  }
}
