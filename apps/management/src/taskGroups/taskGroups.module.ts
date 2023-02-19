import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TaskGroupController } from "./taskGroups.controller";
import { TaskGroupService } from "./taskGroups.service";
import { TaskGroupModel, TaskGroupToClientGroupModel, TaskTypeModel, UserGroupModel } from "@app/model";
import { ShareModule } from "../shared.modules";
import { CommonModule } from "@app/common/common.module";

@Module({
  imports: [ShareModule, SequelizeModule.forFeature([UserGroupModel, TaskTypeModel, TaskGroupModel, TaskGroupToClientGroupModel]), CommonModule],
  controllers: [TaskGroupController],
  providers: [TaskGroupService],
  exports: [SequelizeModule],
})
export class TaskGroupModule { }
