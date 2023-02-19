import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { ProductTypeGroupModel, ProductTypeGroupUserGroupMappingModel } from "@app/model";
import { Op } from "sequelize";
import { ExcelService } from "@app/common";

@Injectable()
export class ProductTypeGroupService {
  constructor(
    @Inject("ProductTypeGroupModelRepository") private productTypeGroupModel: typeof ProductTypeGroupModel,
    @Inject("ProductTypeGroupUserGroupMappingModelRepository") private productTypeUserGroupMapping: typeof ProductTypeGroupUserGroupMappingModel,
    private readonly excelService: ExcelService,
  ) {}

  async getAll(client_id: number): Promise<any> {
    return this.productTypeGroupModel.findAll({
      order: [["product_type_group_order", "ASC"]],
      where: { is_active: true, client_id },
    });
  }

  async createProductTypeGroup(client_id: number, productTypeGroupDto): Promise<any> {
    return await this.productTypeGroupModel.create({
      client_id: client_id,
      product_type_group_name: productTypeGroupDto.product_type_group_name,
    });
  }

  async updateProductTypeGroup({ product_type_group_id, client_id }, productTypeGroupDto): Promise<any> {
    await this.getProductTypeGroupByID(product_type_group_id);

    const result = await this.productTypeGroupModel.findOne({
      where: {
        client_id: client_id,
        product_type_group_name: {
          [Op.like]: `%${productTypeGroupDto.product_type_group_name}%`,
        },
        product_type_group_id: { [Op.not]: product_type_group_id },
      },
    });
    if (result) throw new BadRequestException("Product type name name already exist");

    await this.productTypeGroupModel.update(
      {
        product_type_group_name: productTypeGroupDto.product_type_group_name,
      },
      { where: { product_type_group_id, client_id } },
    );
    return this.productTypeGroupModel.findByPk(product_type_group_id);
  }

  async deleteProductTypeGroup({ product_type_group_id, client_id }) {
    await this.getProductTypeGroupByID(product_type_group_id);
    const productTypeGroup = await this.productTypeGroupModel.findOne({
      where: { product_type_group_id, client_id },
    });
    return await productTypeGroup.destroy();
  }

  async setProductTypeGroupOrder(productTypeGroupOrder, client_id): Promise<any> {
    for (let index = 0; index < productTypeGroupOrder.length; index++) {
      let element = productTypeGroupOrder[index];
      element["product_type_group_order"] = index + 1;
    }
    await this.productTypeGroupModel.bulkCreate(productTypeGroupOrder, {
      updateOnDuplicate: ["product_type_group_order"],
    });
    return this.getAll(client_id);
  }

  async getProductTypeGroupByID(product_type_group_id: number) {
    const ptg = await this.productTypeGroupModel.findByPk(product_type_group_id);
    if (!ptg) throw new BadRequestException("Unable to find Product Type Group");
    return ptg;
  }

  async downloadExcel(client_id: number) {
    const productGroups = await this.getAll(client_id);
    const header = [
      { key: "product_type_group_name", header: "Product Type Group Names" },
      { key: "product_type_group_order", header: "Product Type Group Order" },
    ];
    return await this.excelService.downloadExcel(productGroups, header, {});
  }

  async getProductTypeGroupAndUserGroup(client_id: number) {
    const result = await this.productTypeUserGroupMapping.findAll({
      where: { client_id },
      include:[ { model: ProductTypeGroupModel} ],
    });
    return result;
  }
}
