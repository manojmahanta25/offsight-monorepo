import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {UtilsModule} from "../common/utils.module";
import {RedisService} from "../../service/redis/redis.service";
import RedisMock from "../../service/redis/redis.mock";
import {ClientService} from "./client.service";
import {CreateClientService} from "./create-client.service";

describe('ClientController', () => {
  let controller: ClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      imports:[UtilsModule],
      providers:[ClientService, CreateClientService]
    }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
