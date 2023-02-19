import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {RedisService} from "../../service/redis/redis.service";
import RedisMock from "../../service/redis/redis.mock";
import {UtilsModule} from "../common/utils.module";
import {TwoFactorAuthService} from "./two-factor-auth.service";
import {TwilioModuleConfig} from "@app/config";
import {LoginService} from "../login/login.service";
import {QrCodeUtil} from "../../utils/qrcode/qr-code.util";

describe('TwoFactorAuthController', () => {
  let controller: TwoFactorAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[UtilsModule,TwilioModuleConfig],
      controllers: [TwoFactorAuthController],
      providers:[TwoFactorAuthService,LoginService,QrCodeUtil]
    }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();

    controller = module.get<TwoFactorAuthController>(TwoFactorAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
