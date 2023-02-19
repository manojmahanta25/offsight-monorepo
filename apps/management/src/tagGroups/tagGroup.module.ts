import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagGroupController } from './tagGroup.controller';
import { TagGroupService } from './tagGroup.service';
import { TagGroupModel } from '@app/model'
import { ShareModule } from "../shared.modules"
import { CommonModule } from '@app/common/common.module';

@Module({
  imports: [
    ShareModule,
    SequelizeModule.forFeature([TagGroupModel]),
    CommonModule
  ],
  controllers: [TagGroupController],
  providers: [TagGroupService],
  exports: [SequelizeModule],
})
export class TagGroupModule {}
