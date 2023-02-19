import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import {
  ViewModel,
  ClientModel,
  UserGroupModel,
  ViewToGroupModel,
  UserClientPivotModel,
  UserModel,
  UserAuthModel,
  ZoneToViewModel,
} from '@app/model';
import { ShareModule } from './../shared.modules';
import { CommonModule } from '@app/common/common.module';

@Module({
  imports: [
    ShareModule,
    SequelizeModule.forFeature([
      ClientModel,
      UserModel,
      UserGroupModel,
      UserAuthModel,
      UserClientPivotModel,
      ViewModel,
      ViewToGroupModel,
      ZoneToViewModel,
    ]),
    CommonModule,
  ],
  controllers: [ViewController],
  providers: [ViewService],
  exports: [SequelizeModule],
})
export class ViewModule {}
