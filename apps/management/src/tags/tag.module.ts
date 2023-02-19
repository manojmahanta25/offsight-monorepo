import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagModel } from '@app/model'
import { ShareModule } from "../shared.modules"
import { CommonModule } from '@app/common/common.module';

@Module({
  imports: [
    ShareModule,
    SequelizeModule.forFeature([TagModel]),
    CommonModule
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [SequelizeModule],
})
export class TagModule {}
