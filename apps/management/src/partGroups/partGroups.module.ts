import { CommonModule } from '@app/common/common.module';
import { PartGroupModel } from '@app/model/Management/partGroup.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShareModule } from '../shared.modules';
import { PartGroupsController } from './partGroups.controller';
import { PartGroupsService } from './partGroups.service';

@Module({
  imports: [
    ShareModule,
    SequelizeModule.forFeature([PartGroupModel]),
    CommonModule
  ],
  controllers: [PartGroupsController],
  providers: [PartGroupsService]
})
export class PartGroupsModule { }
