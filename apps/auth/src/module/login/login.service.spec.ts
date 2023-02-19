import {Test, TestingModule} from '@nestjs/testing';
import {LoginService} from './login.service';
import {UtilsModule} from "../common/utils.module";
import {RedisService} from "../../service/redis/redis.service";
import {UnauthorizedException} from "@nestjs/common";
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import RedisMock from "../../service/redis/redis.mock";


describe('LoginService', () => {
    let service: LoginService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UtilsModule],
            providers: [
                LoginService,
            ],
        }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();
        service = module.get<LoginService>(LoginService);
    });

    it('should be defined', async () => {
        expect(service).not.toBeNull();
    });

    it('[verifyLogin] should be able to login', async () => {
        const result = service.verifyLogin('manager@single.test.com', 'Welcome1');
        await expect(result).resolves.not.toBeNull();
    });

    it('[verifyLogin] should be not able to login', async () => {
        const result = service.verifyLogin('manager@single.test.com', 'Welcome1123');
        await expect(result).resolves.toBeNull();
    });

    it('[verifyLoginWithClientId] should be able to login', async () => {
        const result = service.verifyLoginWithClientId(1, 'manager@multi.test.com', 'Welcome1');
        await expect(result).resolves.not.toBeNull();
    });

    it('[verifyLoginWithClientId] should not be able to login', async () => {
        const result = service.verifyLoginWithClientId(31, 'manager@multi.test.com', 'Welcome123');
        await expect(result).resolves.toBeNull();
    });

    it('[verifyLoginWithClientId] should be able to login', async () => {
        const result = service.verifyLoginWithClientId(2, 'manager@multi.test.com', 'Welcome1');
        await expect(result).resolves.not.toBeNull();
    });

    it('[verifyLoginWithBarcodeId] should be able to login', async () => {
        const result = service.verifyLoginWithBarcodeId('test.single-client', 'auth-microservice-test');
        await expect(result).resolves.not.toBeNull();
    });

    it('[verifyLoginWithBarcodeId] should be not able to login', async () => {
        const result = service.verifyLoginWithBarcodeId('test.single-client.1231223', 'auth-microservice-test');
        await expect(result).rejects.toThrow(new UnauthorizedException('invalid input'));
    });

    it('[verifyLoginWithBarcodeIdAndClientId] should be able to login', async () => {
        const result = service.verifyLoginWithBarcodeIdAndClientId(1, 'test.multi-client');
        await expect(result).resolves.not.toBeNull();
    });

    it('[verifyLoginWithBarcodeIdAndClientId] should be not able to login', async () => {
        const result = service.verifyLoginWithBarcodeIdAndClientId(1, 'test.multi-client.1231223');
        await expect(result).resolves.toBeNull();
    });

    it('[authenticationWithUsername] should be able to login', async () => {
        const result = service.authenticationWithUsername('manager@single.test.com', 'Welcome1', 'auth-microservice-test', null);
        await expect(result).resolves.toHaveProperty('token');
        await expect(result).resolves.toHaveProperty('refresher');
        await expect(result).resolves.toHaveProperty('gotoMgt');
    });

    it('[authenticationWithUsername] not have a property client', async () => {
        const result = service.authenticationWithUsername('manager@single.test.com', 'Welcome1', 'auth-microservice-test', null);
        await expect(result).resolves.not.toHaveProperty('clients');
    });

    it('[authenticationWithUsername] multi-account have a property client', async () => {
        const result = service.authenticationWithUsername('manager@multi.test.com', 'Welcome1', 'auth-microservice-test', null);
        await expect(result).resolves.toHaveProperty('clients');
        await expect(result).resolves.toHaveProperty('isUserMultiAccount');
    });

    it('[authenticationWithUsername] multi-account not have a property client', async () => {
        const result = service.authenticationWithUsername('manager@multi.test.com', 'Welcome1', 'auth-microservice-test', null);
        await expect(result).resolves.not.toHaveProperty('token');
        await expect(result).resolves.not.toHaveProperty('refresher');
        await expect(result).resolves.not.toHaveProperty('gotoMgt');
    });

    it('[authenticationWithUsername] should not be able to login', async () => {
        const result = service.authenticationWithUsername('manager@single.test.com', 'Welcome1123asdsaw', 'auth-microservice-test', null);
        await expect(result).rejects.toThrow(new UnauthorizedException('password or username mismatch'));
    });

    it('[authenticationWithBarcodeId] should not be able to login', async () => {
        const result = service.authenticationWithBarcodeId('test.single-client', 'auth-microservice-test');
        await expect(result).resolves.toHaveProperty('token');
        await expect(result).resolves.toHaveProperty('refresher');
        await expect(result).resolves.toHaveProperty('gotoMgt');
    });

    it('[authenticationWithBarcodeId] should not be able to login', async () => {
        const result = service.authenticationWithBarcodeId('test.multi-client', 'auth-microservice-test');
        await expect(result).resolves.toHaveProperty('clients');
        await expect(result).resolves.toHaveProperty('isUserMultiAccount');
    });

    it('[authenticationWithBarcodeId] multi-account have a property client', async () => {
        const result = service.authenticationWithBarcodeId('test.multi-client', 'auth-microservice-test');
        await expect(result).resolves.toHaveProperty('clients');
        await expect(result).resolves.toHaveProperty('isUserMultiAccount');
    });

    it('[authenticationWithBarcodeId] multi-account not have a property client', async () => {
        const result = service.authenticationWithBarcodeId('test.multi-client', 'auth-microservice-test');
        await expect(result).resolves.not.toHaveProperty('token');
        await expect(result).resolves.not.toHaveProperty('refresher');
        await expect(result).resolves.not.toHaveProperty('gotoMgt');
    });

    it('[authenticationWithBarcodeIdAndClientId] should not be able to login', async () => {
        const result = service.authenticationWithBarcodeIdAndClientId(23,'test.single-client.1231223', 'auth-microservice-test');
        await expect(result).rejects.toThrow(new UnauthorizedException('invalid input'));
    });

    it('[authenticationWithBarcodeIdAndClientId] should not be able to login', async () => {
        const result = service.authenticationWithBarcodeIdAndClientId(1,'test.multi-client', 'auth-microservice-test');
        await expect(result).resolves.toHaveProperty('token');
        await expect(result).resolves.toHaveProperty('refresher');
        await expect(result).resolves.toHaveProperty('gotoMgt');
    });

    it('[authenticationWithUsernameAndClientId] should be able to login', async () => {
        const result = service.authenticationWithUsernameAndClientId(1,'manager@multi.test.com', 'Welcome1','auth-microservice-test');
        await expect(result).resolves.toHaveProperty('token');
        await expect(result).resolves.toHaveProperty('refresher');
        await expect(result).resolves.toHaveProperty('gotoMgt');
    });

    it('[authenticationWithUsernameAndClientId] should be not able to login', async () => {
        const result = service.authenticationWithUsernameAndClientId(1,'manager@multi.test.com', 'Welcome1asd','auth-microservice-test');
        await expect(result).rejects.toThrow(new UnauthorizedException('password or username mismatch'));
    });
});
