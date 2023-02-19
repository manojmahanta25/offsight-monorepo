import { Injectable, Inject } from "@nestjs/common";
import { TagModel } from "@app/model";
import { QueryTypes } from "sequelize";

@Injectable()
export class TagService {
  constructor(@Inject("TagModelRepository") private tagModel: typeof TagModel) {}

  async getAll(client_id: number): Promise<any> {
    return this.tagModel.findAll({
      where: { is_active: true, client_id },
    });
  }

  async createTag(client_id: number, tagDto): Promise<any> {
    return await this.tagModel.create({
      client_id: client_id,
      tag_group_id: tagDto.tag_group_id,
      tag_title: tagDto.tag_title,
      tag_description: tagDto.tag_description,
    });
  }

  async updateTag({ tag_id, client_id }, tagDto): Promise<any> {
    await this.tagModel.update(
      {
        tag_group_id: tagDto.tag_group_id,
        tag_title: tagDto.tag_title,
        tag_description: tagDto.tag_description,
      },
      { where: { tag_id, client_id } },
    );
    return this.tagModel.findByPk(tag_id);
  }

  async deleteTag({ tag_id, client_id }): Promise<any> {
    return "NEED TO Place condition for delete tag";
    // return await this.tagModel.update({ tag_is_active: false }, { where: { tag_id, client_id } });
  }

  async setTagOrder(tagOrder, client_id): Promise<any> {
    for (let index = 0; index < tagOrder.length; index++) {
      let element = tagOrder[index];
      element["tag_order"] = index + 1;
    }
    await this.tagModel.bulkCreate(tagOrder, {
      updateOnDuplicate: ["tag_order"],
    });
    return this.getAll(client_id);
  }
}
