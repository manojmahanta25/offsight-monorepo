import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorAuthService } from './two-factor-auth.service';
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {RedisService} from "../../service/redis/redis.service";
import RedisMock from "../../service/redis/redis.mock";
import {UtilsModule} from "../common/utils.module";
import {TwilioModule} from "nestjs-twilio";
import {TwilioModuleConfig} from "@app/config";
import {LoginService} from "../login/login.service";
import {QrCodeUtil} from "../../utils/qrcode/qr-code.util";

describe('TwoFactorAuthService', () => {
  let service: TwoFactorAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[UtilsModule,TwilioModuleConfig],
      providers: [TwoFactorAuthService,LoginService,QrCodeUtil],
    }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();

    service = module.get<TwoFactorAuthService>(TwoFactorAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
