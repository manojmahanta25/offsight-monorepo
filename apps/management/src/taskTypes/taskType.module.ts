import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TaskTypeController } from "./taskType.controller";
import { TaskTypeService } from "./taskType.service";
import { TaskTypeModel } from "@app/model";
import { ShareModule } from "../shared.modules";
import { CommonModule } from "@app/common/common.module";

@Module({
  imports: [ShareModule, SequelizeModule.forFeature([TaskTypeModel]), CommonModule],
  controllers: [TaskTypeController],
  providers: [TaskTypeService],
  exports: [SequelizeModule],
})
export class TaskTypeModule {}
