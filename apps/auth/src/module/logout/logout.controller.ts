import {BadRequestException, Controller, HttpCode, Param, Post, Req, Res, UseGuards} from "@nestjs/common";
import {LogoutService} from "./logout.service";
import {AuthGuard} from "../../middleware/authguard";
import {Request, Response} from "express";
import {HeadersEnum} from "@app/common/enums/headers.enum";
import {ApiTags} from "@nestjs/swagger";
import {JwtPayloadInterface} from "@app/common/interfaces/jwt-payload.interface";
import {ManagementAccessGuard} from "@app/common/gaurd/management-access.guard";

@ApiTags('Logout')
@Controller("logout")
@UseGuards(AuthGuard)
export class LogoutController {
    constructor(private readonly logoutService: LogoutService) {
    }

    @HttpCode(200)
    @Post()
    async logout(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        const token = request.cookies[HeadersEnum.AUTH_TOKEN]
        const deviceIdentifier = request.header(HeadersEnum.DEVICE_IDENTIFIER) || request.cookies[HeadersEnum.DEVICE_IDENTIFIER];
        const result = await this.logoutService.logout(deviceIdentifier,token);
        if (result) {
            response.cookie(HeadersEnum.AUTH_TOKEN, '', {maxAge: 0});
            response.cookie(HeadersEnum.REFRESHER_TOKEN, '', {maxAge: 0});
            return {message: 'logout successfully'};
        } else {
            throw new BadRequestException('Invalid request');
        }
    }

    @HttpCode(200)
    @Post('all-devices')
    async logoutAll(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        const decodeToken = request['decodeToken'] as JwtPayloadInterface;
        const result = await this.logoutService.logoutAll(decodeToken.userId);
        if (result) {
            response.cookie(HeadersEnum.AUTH_TOKEN, '', {maxAge: 0});
            response.cookie(HeadersEnum.REFRESHER_TOKEN, '', {maxAge: 0});
            return {message: 'logout successfully'};
        } else {
            throw new BadRequestException('Invalid request');
        }
    }

    @UseGuards(ManagementAccessGuard)
    @HttpCode(200)
    @Post('all')
    async logoutAllClientUser(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        const decodeToken = request['decodeToken'] as JwtPayloadInterface;
        const result = await this.logoutService.logoutAllClientUser(decodeToken.clientId);
        if (result) {
            response.cookie(HeadersEnum.AUTH_TOKEN, '', {maxAge: 0});
            response.cookie(HeadersEnum.REFRESHER_TOKEN, '', {maxAge: 0});
            return {message: 'logout all users successfully'};
        } else {
            throw new BadRequestException('Invalid request');
        }
    }

    @UseGuards(ManagementAccessGuard)
    @HttpCode(200)
    @Post('all-except-current-device')
    async logoutAllClientUserExceptCurrentDevice(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        const decodeToken = request['decodeToken'] as JwtPayloadInterface;
        const deviceIdentifier = request.header(HeadersEnum.DEVICE_IDENTIFIER) || request.cookies[HeadersEnum.DEVICE_IDENTIFIER];
        await this.logoutService.logoutAllClientUserExceptCurrentDevice(decodeToken.clientId, deviceIdentifier);

        return {message: 'logout All Client User Except Current Device successfully'};

    }

    @UseGuards(ManagementAccessGuard)
    @HttpCode(200)
    @Post('this-user/:userId')
    async logoutParticularUser(@Req() request: Request,@Param('userId') userId:number, @Res({passthrough: true}) response: Response) {
        const decodeToken = request['decodeToken'] as JwtPayloadInterface;
        await this.logoutService.logoutAParticularClientUser(decodeToken.clientId,userId);
        return {message: 'logout Particular User successfully'};

    }
}