import {Test, TestingModule} from '@nestjs/testing';
import {UserService} from './user.service';
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {RedisService} from "../../service/redis/redis.service";
import RedisMock from "../../service/redis/redis.mock";
import {UtilsModule} from "../common/utils.module";
import {MailService} from "@app/common";

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UtilsModule],
            providers: [UserService],
        }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).overrideProvider(MailService).useValue({}).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Should list all user by client id', async () => {
        const users = await service.listAllUserByClientId(1);
        expect(users.length).toBe(2);
    });

    it('Should get user by id', async () => {

        const user = service.getUserById(1);
       await expect(user.then(u=>u.id)).resolves.toEqual(1);
    });

    it('Should update user by id', async () => {
      const userDto = {
        firstName: 'test update',
        email:'test@supertal.io'
      }
       const result = await service.updateUserById(1, userDto);
        expect(result.firstName).toEqual(userDto.firstName);
        expect(result.email).toEqual(userDto.email);
    });

    it('Should update user profile photo', async () => {
        const userDto = {
            profileImage: 'test update',
        }
        const result = await service.updateUserProfilePhoto(1, userDto);
        expect(result.profileImage).toEqual(userDto.profileImage);
    });

    it('should update user password', async () =>{
        const password = 'Welcome1';
        const newPassword='test';
        const result = await service.updateUserPassword(1, {password,newPassword});
        expect(result).toEqual(true);
    });

});
