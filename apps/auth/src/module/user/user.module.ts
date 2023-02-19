import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {ShareModule} from "../common/share.module";
import {MailService} from "@app/common";


@Module({
  imports:[ShareModule],
  providers: [UserService, MailService],
  controllers: [UserController]
})
export class UserModule {}
