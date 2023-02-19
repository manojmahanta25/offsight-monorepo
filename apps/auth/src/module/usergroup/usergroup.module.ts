import { Module } from '@nestjs/common';
import { UserGroupController } from './usergroup.controller';
import { UserGroupService } from './user-group.service';
import {ShareModule} from "../common/share.module";
import {ExcelService} from "@app/common";

@Module({
  imports: [ShareModule],
  controllers: [UserGroupController],
  providers: [UserGroupService, ExcelService]
})
export class UserGroupModule {}
