import {Test, TestingModule} from '@nestjs/testing';
import {LogoutService} from "./logout.service";
import {UtilsModule} from "../common/utils.module";
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {RedisService} from "../../service/redis/redis.service";
import RedisMock from "../../service/redis/redis.mock";


describe('LoginService', () => {
    let service: LogoutService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UtilsModule],
            providers: [
                LogoutService,
            ],
        }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();
        service = module.get<LogoutService>(LogoutService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

});
