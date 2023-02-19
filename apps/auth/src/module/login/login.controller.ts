import {
    BadRequestException,
    Body,
    Controller, HttpCode,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
    UseInterceptors
} from "@nestjs/common";
import {LoginService} from "./login.service";
import {HeadersEnum} from "@app/common/enums/headers.enum";
import {LoginDto, LoginWithBarcodeIdDto, LoginWithVerifyTokenDto, RefreshTokenDto} from "./login.dto";
import {Request, Response} from "express";
import {ApiBody, ApiQuery, ApiTags} from "@nestjs/swagger";
import {TransformResponseInterceptor} from "@app/common";

@ApiTags('Login')
@Controller("login")
@UseInterceptors(TransformResponseInterceptor)
export class LoginController {
    constructor(private readonly loginService: LoginService) {
    }

    @HttpCode(HttpStatus.OK)
    @ApiBody({type: LoginDto})
    @Post()
    async login(
        @Req() request: Request,
        @Body() loginDto: LoginDto,
        @Res({passthrough: true}) response: Response
    ) {
        const deviceIdentifier = this.loginService.getOrSetDeviceIdentifier(request);
        let result
        if (loginDto.clientId) {

            result = await this.loginService.authenticationWithUsernameAndClientId(loginDto.clientId, loginDto.username, loginDto.password, deviceIdentifier)

        } else {

            result = await this.loginService.authenticationWithUsername(loginDto.username, loginDto.password, deviceIdentifier, loginDto.captcha)

        }
        return this.loginService.loginResponse(response, result, deviceIdentifier);
    }

    @ApiBody({type: LoginWithBarcodeIdDto})
    @HttpCode(HttpStatus.OK)
    @Post('barcodeid')
    async loginWithBarcodeId(
        @Req() request: Request,
        @Body() loginWithBarcodeIdDto: LoginWithBarcodeIdDto,
        @Res({passthrough: true}) response: Response,
    ) {
        const deviceIdentifier = this.loginService.getOrSetDeviceIdentifier(request);
        let result;

        if (loginWithBarcodeIdDto.clientId) {
            result = await this.loginService.authenticationWithBarcodeIdAndClientId(loginWithBarcodeIdDto.clientId, loginWithBarcodeIdDto.barcodeId, deviceIdentifier)
        } else {
            result = await this.loginService.authenticationWithBarcodeId(loginWithBarcodeIdDto.barcodeId, deviceIdentifier)
        }
        return this.loginService.loginResponse(response, result, deviceIdentifier);

    }

    @HttpCode(HttpStatus.OK)
    @Post('verify-token')
    @ApiBody({type: LoginWithVerifyTokenDto})
    async loginWithToken(
        @Req() request: Request,
        @Body() loginWithVerifyTokenDto: LoginWithVerifyTokenDto,
        @Res({passthrough: true}) response: Response,
    ) {
        const deviceIdentifier = this.loginService.getOrSetDeviceIdentifier(request);
        const result = await this.loginService.authenticateWithVerifyToken(loginWithVerifyTokenDto.verifyToken,loginWithVerifyTokenDto.clientId ,deviceIdentifier);
        return this.loginService.loginResponse(response, result, deviceIdentifier);
    }


    @HttpCode(HttpStatus.OK)
    @Post('refresh-access-token')
    @ApiBody({type: RefreshTokenDto,  description: 'refresher token',required: false})
    @ApiQuery({name: 'refresher-token', required: false})
    async loginWithRefreshToken(
        @Req() request: Request,
        @Body() RefreshTokenDto:RefreshTokenDto,
        @Res({passthrough: true}) response: Response,
        @Query('refresher-token') refresherTokenQuery: string
    ) {
        let refresherToken: string = RefreshTokenDto.refresherToken || refresherTokenQuery || request.header(HeadersEnum.REFRESHER_TOKEN) || request.cookies[HeadersEnum.REFRESHER_TOKEN];
        const deviceIdentifier = this.loginService.getOrSetDeviceIdentifier(request);
        if (refresherToken) {
            console.log('refresherToken',refresherToken)
            const result = await this.loginService.refreshAccessToken(refresherToken, deviceIdentifier);
            response.cookie(HeadersEnum.DEVICE_IDENTIFIER, deviceIdentifier, {
                maxAge:10*365 * 24 * 60 * 60*1000,
                sameSite: 'none',
            });
            response.cookie(HeadersEnum.AUTH_TOKEN, result.token, {
                maxAge: 60 * 60 * 1000 ,//1 hour,
                sameSite: 'none',
            })
            return {
                message: 'login successfully',
                token: result.token,
                expire: 60 * 60
            }
        } else {
            throw new BadRequestException('refresher token is required');
        }

    }


}
