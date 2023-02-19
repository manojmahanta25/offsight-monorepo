import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ProductTypeController } from "./productType.controller";
import { ProductTypeService } from "./productType.service";
import { ProductTypeModel, ProductTypeGroupUserGroupMappingModel, UserGroupModel } from "@app/model";
import { ShareModule } from "../shared.modules";
import { CommonModule } from "@app/common/common.module";
import { AWSModule } from "@app/config";

@Module({
  imports: [ShareModule, AWSModule, SequelizeModule.forFeature([ProductTypeModel, UserGroupModel, ProductTypeGroupUserGroupMappingModel]), CommonModule],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [SequelizeModule],
})
export class ProductTypeModule {}
