import { Test, TestingModule } from '@nestjs/testing';
import {LogoutService} from "./logout.service";
import {LogoutController} from "./logout.controller";
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {RedisService} from "../../service/redis/redis.service";
import RedisMock from "../../service/redis/redis.mock";
import {UtilsModule} from "../common/utils.module";

describe('LogoutController', () => {
    let controller: LogoutController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports:[UtilsModule],
            controllers: [LogoutController],
            providers:[LogoutService]
        }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();

        controller = module.get<LogoutController>(LogoutController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});