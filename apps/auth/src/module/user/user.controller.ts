import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards, UseInterceptors
} from '@nestjs/common';
import {UserService} from "./user.service";
import {Request} from "express";
import {JwtPayloadInterface} from "@app/common/interfaces/jwt-payload.interface";
import {
    CreateUserByAdminDto,
    LinkUserToClientDto,
    UserChangePasswordDto,
    UserEditDto, UserForgotPasswordDto, UserResetPasswordDto, UserUpdateBarcodeId,
    UserUpdateProfilePhotoDto
} from "./user.dto";
import {AuthGuard} from "../../middleware/authguard";
import {ApiTags} from "@nestjs/swagger";
import {TransformResponseInterceptor} from "@app/common";
import {ManagementAccessGuard} from "@app/common/gaurd/management-access.guard";

@ApiTags('User')
@Controller('user')
@UseInterceptors(TransformResponseInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @UseGuards(AuthGuard,ManagementAccessGuard)
    @Get('management')
    async findAllByAdmin(@Req() req: Request) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        return this.userService.listAllUserByClientId(decodeToken.clientId);
    }

    @UseGuards(AuthGuard,ManagementAccessGuard)
    @Post('management/create')
    async createByAdmin(@Req() req: Request, @Body() createUserByAdminDto: CreateUserByAdminDto) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        return this.userService.createUserByAdmin(decodeToken.clientId, createUserByAdminDto);
    }


    @UseGuards(AuthGuard,ManagementAccessGuard)
    @Put('management/:id')
    async updateByAdmin(@Req() req: Request, @Body() createUserByAdminDto: CreateUserByAdminDto, @Param('id') id: number) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        return this.userService.updateUserByAdmin(decodeToken.clientId, id, req.body);
    }

    @UseGuards(AuthGuard,ManagementAccessGuard)
    @Post('management/link')
    async linkUserToClientByAdmin(@Req() req: Request, @Body() linkUserToClientDto: LinkUserToClientDto) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        return this.userService.createLinkUser(decodeToken.clientId, linkUserToClientDto);
    }


    @UseGuards(AuthGuard,ManagementAccessGuard)
    @Delete('management/:id')
    async deactivateUserByAdmin(@Req() req: Request, @Param('id') id: number) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        return this.userService.deactivateUserByAdmin(decodeToken.clientId, id);
    }

    @UseGuards(AuthGuard,ManagementAccessGuard)
    @Post('management/:id/reset-password')
    async resetPasswordByAdmin(@Req() req: Request, @Param('id') id: number) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        return this.userService.resetUserPasswordByAdmin(decodeToken.clientId, id);
    }

    @UseGuards(AuthGuard)
    @Get()
    async findOne(@Req() req: Request) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        return this.userService.getUserById(decodeToken.userId);
    }

    @Post('verify-link')
    async linkUserToClientToken(@Req() req: Request, @Query('token') token: string) {
        if(!token) {
            throw new ForbiddenException('Invalid token');
        }
        return this.userService.linkedClientByToken(token);
    }

    @UseGuards(AuthGuard)
    @Put('update')
    async update(@Req() req: Request, @Body() userDto: Partial<UserEditDto>) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        return this.userService.updateUserById(decodeToken.userId, userDto);
    }

    @UseGuards(AuthGuard)
    @Put('update/profile-photo')
    async updateProfilePhoto(@Req() req: Request, @Body() userDto: UserUpdateProfilePhotoDto) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        return this.userService.updateUserProfilePhoto(decodeToken.userId, userDto);
    }

    @UseGuards(AuthGuard)
    @Put('update/password')
    async updatePassword(@Req() req: Request, @Body() userDto: UserChangePasswordDto) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        if (decodeToken.userGroupPermission.enablePasswordResetNoUserEmail) {
            return this.userService.updateUserPassword(decodeToken.userId, userDto);
        } else {
            throw new ForbiddenException('You are not allowed to change password, please contact your administrator');
        }

    }

    @UseGuards(AuthGuard)
    @Put('update/barcodeid')
    async updateBarcodeId(@Req() req: Request, @Body() userDto: UserUpdateBarcodeId) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        return this.userService.updateBarcodeId(decodeToken.userId, userDto.barcodeId);
    }

    @Post('forgot-password')
    async forgotPassword(@Req() req: Request, @Body() userForgotPasswordDto:UserForgotPasswordDto) {
        return this.userService.forgotPasswordLink(userForgotPasswordDto.username);
    }

    @Post('forgot-password/verify-link')
    async forgotPasswordVerifyLink(@Req() req: Request, @Query('token') token: string, @Body() userResetPasswordDto:UserResetPasswordDto) {
        if(!token) {
            throw new ForbiddenException('Invalid token');
        }
        return this.userService.forgotPasswordVerifyLink(token,userResetPasswordDto.password);
    }

    @Post('forgot-password/token-verify')
    async checkIfUserPasswordTokenValid(@Req() req: Request, @Query('token') token: string) {
        if(!token) {
            throw new ForbiddenException('Invalid token');
        }
        return this.userService.passwordResetTokenIsValid(token);
    }
}
