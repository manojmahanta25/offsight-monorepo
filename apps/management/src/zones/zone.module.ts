import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZoneController } from './zone.controller';
import { ZoneService } from './zone.service';
import { ViewModel, ZoneModel, ZoneToViewModel } from '@app/model'
import { ShareModule } from "../shared.modules"
import { CommonModule } from '@app/common/common.module';

@Module({
  imports: [
    ShareModule,
    SequelizeModule.forFeature([ViewModel, ZoneModel, ZoneToViewModel]),
    CommonModule
  ],
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [SequelizeModule],
})
export class ZoneModule {}
