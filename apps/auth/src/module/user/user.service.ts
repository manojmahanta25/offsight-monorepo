import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {UserModel} from "@app/model/User/user.model";
import {
    CreateUserByAdminDto,
    LinkUserToClientDto,
    UserChangePasswordDto,
    UserEditDto,
    UserUpdateProfilePhotoDto
} from "./user.dto";
import {SaltUtil} from "../../utils/salt/salt.util";
import {UserClientPivotModel} from "@app/model/User/user-client-pivot.model";
import {userRedisClient as redisClient} from '../../config/redis/redisClient';
import {UserConfigModel, UserPermissionModel} from "@app/model";
import {MailService} from "@app/common";
import {UserModelCache} from "../../model/user-model.cache";
import {UserGroupModelCache} from "../../model/usergroup-model.cache";

@Injectable()
export class UserService {
    constructor(
        private userModelCache: UserModelCache,
        @Inject('UserClientPivotModelRepository')
        private readonly userClientPivotModel: typeof UserClientPivotModel,
        private userGroupModelCache: UserGroupModelCache,
        @Inject('UserPermissionModelRepository')
        private readonly userPermissionModel: typeof UserPermissionModel,
        @Inject('UserConfigModelRepository')
        private readonly userConfigModel: typeof UserConfigModel,
        private saltUtil: SaltUtil,
        private readonly emailService: MailService,
    ) {
    }

    async listAllUserByClientId(clientId: number): Promise<UserModel[]> {
        return  await this.userModelCache.findAll({
            include: [{
                model: UserClientPivotModel,
                where: {clientId: clientId, isActive: 1},
                attributes: [],
            }],
            attributes:{exclude:['password','userSlug','userSid','isFirstTime','user2faEnable']}
        })
    }

    async getUserById(userId: number): Promise<UserModel> {
        const user = await this.userModelCache.findByUserIdIncludeClient(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async updateUserById(userId: number, userDto: Partial<UserEditDto>) {
        const update = await this.userModelCache.update(userDto, {
            where: {id: userId}
        })
        if (update[0] === 0) {
            throw new NotFoundException('User not found');
        }
        return await this.userModelCache.findByUserIdForLogin(userId);
    }

    async updateUserByAdmin(clientId: number, userId: number, userDto: Partial<CreateUserByAdminDto>) {
        const userGroup = await this.userGroupModelCache.findByUserGroupIdAndClientId(userDto.userGroupId,clientId);
        if (!userGroup) {
            throw new NotFoundException('User Group not found')
        }
        const update = await this.userModelCache.updateNoCache(userDto, {
            where: {id: userId}
        })
        await this.userClientPivotModel.update({
            userGroupId: userGroup.id,
        }, {where: {userId: userId, clientId: clientId}})
        if (update[0] === 0) {
            throw new NotFoundException('User not found');
        }
        await this.userModelCache.removeCacheByUserId(userId);
        return await this.userModelCache.findByUserIdForLogin(userId);
    }

    async createUserByAdmin(clientId: number, userDto: CreateUserByAdminDto) {
        if (await this.checkUserNameExist(userDto.username)) {
            throw new HttpException('Username already exist', 409);
        }
        const userGroup = await this.userGroupModelCache.findByUserGroupIdAndClientId(userDto.userGroupId,clientId);
        if (!userGroup) {
            throw new NotFoundException('User Group not found')
        }
        const password = this.saltUtil.encryptMd5('Welcome1')
        const user = await this.userModelCache.create({
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            phoneNumber: userDto.phoneNumber,
            email: userDto.email,
            username: userDto.username,
            password: password,
            userSlug: this.saltUtil.generateUUID(),
            isFirstTime: true,
        })
        await this.userClientPivotModel.create({
            clientId: clientId,
            userId: user.id,
            userGroupId: userGroup.id,
            isActive: 1,
        })
        return user;

    }

    async createLinkUser(clientId: number, linkUserToClientDto: LinkUserToClientDto) {
        const user = await this.userModelCache.findByUsernameForLogin(linkUserToClientDto.username);

        if (!user) {
            throw new NotFoundException('User not found')
        }
        const userGroup = await this.userGroupModelCache.findByUserGroupIdAndClientId(linkUserToClientDto.userGroupId,clientId);
        if (!userGroup) {
            throw new NotFoundException('User Group not found')
        }
        const userClientPivot = await this.userClientPivotModel.findOne({
            where: {clientId: clientId, userId: user.id}
        })
        if (userClientPivot) {
            throw new HttpException('User already linked to client', 409);
        }
        const token = this.saltUtil.encryptMd5(this.saltUtil.generateUUID());
        const payload = {
            clientId: clientId,
            userId: user.id,
            userGroupId: userGroup.id,
            email: linkUserToClientDto.email,
        }
        await redisClient.set(token, JSON.stringify(payload), {EX: 60 * 60 * 24 * 7});

        const url = `${process.env.APP_URL}verify-link-user?token=${token}`; //todo add url
        //todo Send email
        {
            await this.emailService.sendEmail(linkUserToClientDto.email, 'noreply@offsight.com', 'linkuser', 'linkuser', {
                link: url,
                valid: '7 days'
            });
        }

        return linkUserToClientDto.email;
    }

    async linkedClientByToken(token: string): Promise<boolean> {
        const checkTokenExist: number = await redisClient.exists(token);
        if (!(checkTokenExist > 0)) {
            throw new HttpException('Token Expire', 419);
        }
        const payload = JSON.parse(await redisClient.get(token)) as {
            clientId: number,
            userId: number,
            userGroupId: number,
            email: string,
        };
        const userClientPivot = await this.userClientPivotModel.findOne({
                where: {clientId: payload.clientId, userId: payload.userId}
            }
        )
        if (userClientPivot) {
            throw new HttpException('User already linked to client', 409);
        }
        await this.userClientPivotModel.create({
            clientId: payload.clientId,
            userId: payload.userId,
            userGroupId: payload.userGroupId,
            isActive: 1,
        })
        await redisClient.del(token);
        return true;
    }

    async deactivateUserByAdmin(clientId: number, userId: number): Promise<boolean> {
        const userClientPivot = await this.userClientPivotModel.findOne({
            where: {clientId: clientId, userId: userId}
        })
        if (!userClientPivot) {
            throw new NotFoundException('User not found')
        }
        await this.userClientPivotModel.update({
            isActive: 0,
        }, {where: {clientId: clientId, userId: userId}})
        return true;
    }

    async updateUserProfilePhoto(userId: number, userUpdateProfilePhotoDto: UserUpdateProfilePhotoDto): Promise<UserModel> {
        const user = await this.userModelCache.update({
            profileImage: userUpdateProfilePhotoDto.profileImage,
        }, {where: {id: userId}});
        if (user[0] === 0) {
            throw new NotFoundException('User not found');
        }
        return await this.userModelCache.findOne({where: {id: userId}});
    }

    async updateUserPassword(userId: number, userUpdatePasswordDto: UserChangePasswordDto): Promise<boolean> {
        const user = await this.userModelCache.findOne({
            where: {
                id: userId,
                password: this.saltUtil.encryptMd5(userUpdatePasswordDto.password)
            }
        });
        if (!user) {
            throw new HttpException('Invalid Password', 401);
        }
        await this.userModelCache.update({
            password: this.saltUtil.encryptMd5(userUpdatePasswordDto.newPassword),
        }, {where: {id: userId}});
        //TODO promote logout
        return true;
    }

    async resetUserPasswordByAdmin(clientId: number, userId: number): Promise<boolean> {
        const user = await this.userModelCache.findByUserIdForLogin(userId);
        if (!user) {
            throw new NotFoundException('User not found')
        }
        if(user.userClientPivots.filter(userClientPivot => userClientPivot.clientId === clientId).length === 0){
            throw new NotFoundException('User not found')
        }

        await this.userModelCache.update({
            password: this.saltUtil.encryptMd5('Welcome1'),
        }, {where: {id: userId}});
        return true;
    }

    async updateBarcodeId(userId: number, barcodeId: string): Promise<boolean> {
        const user = await this.userModelCache.findByUserIdForLogin(userId);
        if (!user) {
            throw new NotFoundException('User not found')
        }
        await this.userModelCache.update({
            barcodeId: barcodeId,
        }, {where: {id: userId}});
        return true;
    }

    private async checkUserNameExist(username: string): Promise<boolean> {
        const user = await this.userModelCache.findByUsernameForLogin(username);
        return !!user;
    }

    getUserSettings(userId: number, clientId: number) {
        const userClientPivot = this.userClientPivotModel.findOne({
            where: {
                userId: userId,
                clientId: clientId,
                isActive: 1
            }
        });

    }

    async forgotPasswordLink(username: string) {
        const user =await this.userModelCache.findByUsernameForLogin(username);

        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.email || user.email === '') {
            throw new HttpException('No Email is attached to this account, Please contact your admin', 403);
        }
        const token = this.saltUtil.encryptMd5(this.saltUtil.generateUUID());
        const payload = {
            userId: user.id,
        }
        await redisClient.set(token, JSON.stringify(payload), {
            EX: 60 * 5,
        });

        const url = `${process.env.APP_URL}verify-link-user?token=${token}`; //todo add url
        //todo Send email
        {
            await this.emailService.sendEmail(user.email, 'noreply@offsight.com', 'forget password link', 'forgot password', {
                link: url,
                valid: '5 minutes'
            });
        }

        return true;

    }

    async passwordResetTokenIsValid(token: string) {
        const checkTokenExist: number = await redisClient.exists(token);
        if (!(checkTokenExist > 0)) {
            throw new HttpException('Token Expire', 419);
        }
        return true;
    }

    async forgotPasswordVerifyLink(token: string, password: string) {
        await this.passwordResetTokenIsValid(token);
        const payload = JSON.parse(await redisClient.get(token)) as {
            userId: number,
        };
        await this.userModelCache.update({
            password: this.saltUtil.encryptMd5(password),
        }, {where: {id: payload.userId}});
        await redisClient.del(token);
        return true;
    }
}
