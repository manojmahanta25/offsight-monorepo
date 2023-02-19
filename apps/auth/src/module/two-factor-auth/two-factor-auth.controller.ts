import {Body, Controller, Delete, HttpCode, Post, Req, Res, UseGuards, UseInterceptors} from '@nestjs/common';
import {TwoFactorAuthService} from "./two-factor-auth.service";
import {AuthGuard} from "../../middleware/authguard";
import {Request, Response} from "express";
import {TwoFactorAuthEnableDto, TwoFactorAuthVerifyDto, TwoFactorLoginDto} from "./TwoFactor.dto";
import {JwtPayloadInterface} from "@app/common/interfaces/jwt-payload.interface";
import {ApiTags} from "@nestjs/swagger";
import {LoginService} from "../login/login.service";
import {TransformResponseInterceptor} from "@app/common";

@ApiTags('OTP')
@UseInterceptors(TransformResponseInterceptor)
@Controller('otp')
export class TwoFactorAuthController {
    constructor(private readonly twoFactorAuthService: TwoFactorAuthService, private loginService: LoginService) {
    }

    @HttpCode(200)
    @Post()
    async verifyTwoFactorAuth(@Req() req: Request, @Body() twoFactorLoginDto: TwoFactorLoginDto, @Res({passthrough: true}) res: Response) {
        return  this.twoFactorAuthService.twoFactorAuthLogin(twoFactorLoginDto.verifyToken, twoFactorLoginDto.code);
    }

    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Post('enable')
    async enableTwoFactorAuth(@Req() req: Request, @Body() twoFactorAuthEnableDto: TwoFactorAuthEnableDto) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const userId = decodeToken.userId;
        return this.twoFactorAuthService.enableTwoFactorAuth(userId, twoFactorAuthEnableDto.name);
    }

    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Post('verify')
    async verifyTwoFactorAuthCode(@Req() req: Request,@Body() twoFactorAuthVerifyDto: TwoFactorAuthVerifyDto) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const userId = decodeToken.userId;
        return this.twoFactorAuthService.verifyToEnable2Fa(userId,twoFactorAuthVerifyDto.code);
    }

    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Delete('disable')
    async disableTwoFactorAuth(@Req() req: Request, @Body() twoFactorAuthVerifyDto: TwoFactorAuthVerifyDto) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const userId = decodeToken.userId;
        return this.twoFactorAuthService.disableTwoFactorAuth(userId, twoFactorAuthVerifyDto.code);
    }


}

