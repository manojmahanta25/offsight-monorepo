import {Test, TestingModule} from '@nestjs/testing';
import {UserGroupService} from './user-group.service';
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {RedisService} from "../../service/redis/redis.service";
import RedisMock from "../../service/redis/redis.mock";
import {ExcelService} from "@app/common";

describe('UsergroupService', () => {
    let service: UserGroupService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserGroupService,ExcelService],
        }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();

        service = module.get<UserGroupService>(UserGroupService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get user group', async () => {
        const result = service.getUserGroup(1, 1)
        await expect(result).resolves.not.toBeNull();
    });

    it('should get user group list', async () => {
        const result = service.listUserGroup(1)
        await expect(result).resolves.not.toBeNull();
    });

    it('should create user group', async () => {
        const payload = {
          groupName: 'Alpha',
          loginAccessManagementTool: 1,
          enablePasswordResetNoUserEmail: 1
        }
        const result = service.createUserGroup(1, payload);
        await expect(result).resolves.not.toBeNull();
    });

    it('should update user group', async () => {
        const payload = {
          groupName: 'AlphaTest',
          loginAccessManagementTool: 1,
          enablePasswordResetNoUserEmail: 1
        }
        const result = service.updateUserGroup(1, 1, payload);
        await expect(result).resolves.not.toBeNull();
    });

});
