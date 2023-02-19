import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {RedisService} from "../../service/redis/redis.service";
import RedisMock from "../../service/redis/redis.mock";
import {UtilsModule} from "../common/utils.module";
import {UserService} from "./user.service";
import {ExcelService} from "@app/common";

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[UtilsModule],
      controllers: [UserController],
      providers:[UserService]
    }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
