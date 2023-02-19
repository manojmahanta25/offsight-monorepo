import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import {ShareModule} from "../common/share.module";
import {LoginService} from "./login.service";
import {UtilsModule} from "../common/utils.module";
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {RedisService} from "../../service/redis/redis.service";
import RedisMock from "../../service/redis/redis.mock";

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[UtilsModule],
      controllers: [LoginController],
      providers:[LoginService]
    }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
