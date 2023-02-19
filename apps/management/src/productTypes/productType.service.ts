import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { ProductTypeModel, UserGroupModel, ProductTypeGroupUserGroupMappingModel } from "@app/model";
import { Op } from "sequelize";
import { S3ManagerService } from "@app/config";
import { CreateProductTypeDto } from "./dto/create-productType.dto";

@Injectable()
export class ProductTypeService {
  constructor(
    @Inject("ProductTypeModelRepository") private productTypeModel: typeof ProductTypeModel,
    @Inject("ProductTypeGroupUserGroupMappingModelRepository") private productTypeUserGroupMapping: typeof ProductTypeGroupUserGroupMappingModel,
    @Inject("UserGroupModelRepository") private userGroupModel: typeof UserGroupModel,
    private s3ManagerService: S3ManagerService,
  ) {}

  async getAll(client_id: number): Promise<any> {
    return this.productTypeModel.findAll({
      order: [["product_type_order", "ASC"]],
      where: { product_type_is_active: true, client_id },
    });
  }

  async createProductType(client_id: number, productTypeDto: CreateProductTypeDto): Promise<any> {
    const result = await this.productTypeModel.create({
      client_id: client_id,
      product_type_name: productTypeDto.product_type_name,
      product_type_group_id: productTypeDto.product_type_group_id,
      product_type_default_zone_id: productTypeDto.product_type_default_zone_id,
    });

    if (result) {
      const userGroups = await this.userGroupModel.findAll({ attributes: ["id"], where: { clientId: client_id, clientUserGroupIsActive: true } });
      if (userGroups && userGroups.length) {
        const data = [];
        userGroups.forEach(item => {
          data.push({
            enable_alerts: true,
            product_type_id: result.product_type_id,
            product_type_group_id: result.product_type_group_id,
            user_group_id: item.id,
            client_id,
          });
        });
        await this.productTypeUserGroupMapping.bulkCreate(data);
      }
    }

    return result;
  }

  async updateProductType({ product_type_id, client_id }, productTypeDto): Promise<any> {
    await this.getProductTypeByID(product_type_id);

    const result = await this.productTypeModel.findOne({
      where: {
        client_id: client_id,
        product_type_name: {
          [Op.like]: `%${productTypeDto.product_type_name}%`,
        },
        product_type_id: { [Op.not]: product_type_id },
      },
    });
    if (result) throw new BadRequestException("Product type name name already exist");

    await this.productTypeModel.update(
      {
        product_type_name: productTypeDto.product_type_name,
        product_type_group_id: productTypeDto.product_type_group_id,
        product_type_default_zone_id: productTypeDto.product_type_default_zone_id,
      },
      { where: { product_type_id, client_id } },
    );
    return this.productTypeModel.findByPk(product_type_id);
  }

  async deleteProductType({ product_type_id, client_id }) {
    const prodType = await this.getProductTypeByID(product_type_id);
    return prodType.destroy();
  }

  async setProductTypeOrder(productTypeOrder, client_id): Promise<any> {
    for (let index = 0; index < productTypeOrder.length; index++) {
      let element = productTypeOrder[index];
      element["product_type_order"] = index + 1;
    }
    await this.productTypeModel.bulkCreate(productTypeOrder, {
      updateOnDuplicate: ["product_type_order"],
    });
    return this.getAll(client_id);
  }

  async addAvatar(product_type_id, client_id, originalname, buffer) {
    const prodType = await this.getProductTypeByID(product_type_id);
    const path = `${process.env.ENV}/${client_id}/product_type`;
    const data = await this.s3ManagerService.uploadFile(originalname, buffer, path);
    if (data) {
      prodType.client_device_image_url = data.fileUrl;
      prodType.client_device_image_url_s3 = data.fileUrl;
      prodType.save();
      return prodType;
    } else throw new BadRequestException("Unable to upload Product type Image");
  }

  async deleteAvatar(product_type_id: number, client_id: number) {
    const prodType = await this.getProductTypeByID(product_type_id);
    const files = [{ Key: prodType.client_device_image_url }];
    const data = await this.s3ManagerService.deleteFiles(files);
    if (data) {
      prodType.client_device_image_url = "";
      prodType.client_device_image_url_s3 = "";
      prodType.save();
      return prodType;
    } else throw new BadRequestException("Unable to delete Product type Image");
  }

  async getProductTypeByID(product_type_id: number) {
    const pt = await this.productTypeModel.findByPk(product_type_id);
    if (!pt) throw new BadRequestException("Unable to find Product Type");
    return pt;
  }
}
