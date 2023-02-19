import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ProductTypeGroupController } from "./productTypeGroup.controller";
import { ProductTypeGroupService } from "./productTypeGroup.service";
import { ProductTypeGroupModel, UserGroupModel, ProductTypeGroupUserGroupMappingModel, ProductTypeModel } from "@app/model";
import { ShareModule } from "../shared.modules";
import { CommonModule } from "@app/common/common.module";

@Module({
  imports: [ShareModule, SequelizeModule.forFeature([ProductTypeGroupModel, ProductTypeModel, ProductTypeGroupUserGroupMappingModel, UserGroupModel]), CommonModule],
  controllers: [ProductTypeGroupController],
  providers: [ProductTypeGroupService],
  exports: [SequelizeModule],
})
export class ProductTypeGroupModule {}
