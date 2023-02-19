import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {RedisService} from "./service/redis/redis.service";
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import RedisMock from "./service/redis/redis.mock";

describe('AppController', () => {
  let appController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();;

    appController = app.get<AuthController>(AuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe(
        '☢️Welcome to Auth microservice!! ☢',
      );
    });
  });
});
