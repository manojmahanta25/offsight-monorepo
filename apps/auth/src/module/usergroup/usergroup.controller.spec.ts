import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupController } from './usergroup.controller';
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {RedisService} from "../../service/redis/redis.service";
import RedisMock from "../../service/redis/redis.mock";
import {UserGroupService} from "./user-group.service";
import {UtilsModule} from "../common/utils.module";
import {ExcelService} from "@app/common";

describe('UserGroupController', () => {
  let controller: UserGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[UtilsModule],
      controllers: [UserGroupController],
      providers: [UserGroupService, ExcelService],
    }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();

    controller = module.get<UserGroupController>(UserGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
