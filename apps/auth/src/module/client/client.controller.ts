import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    Post,
    Put,
    Req,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {CreateClientDto} from "./create-client.dto";
import {CreateClientService} from "./create-client.service";
import {ManagementAccessGuard} from "@app/common/gaurd/management-access.guard";
import {AuthGuard} from "../../middleware/authguard";
import {ClientTaskSubmitTextDto} from "./client.dto";
import {ClientService} from "./client.service";
import {JwtPayloadInterface} from "@app/common/interfaces/jwt-payload.interface";
import {Request} from "express";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TransformResponseInterceptor} from "@app/common";

@ApiTags('Client')
@UseInterceptors(TransformResponseInterceptor)
@Controller('client')
@UseGuards(AuthGuard)
export class ClientController {
    private _usernameArray: string[] = ['ankit@supertal.io','manoj@supertal.io'];
    constructor(private createClientService: CreateClientService, private clientService: ClientService) {
    }

    @HttpCode(201)
    @Post('create')
    @ApiOperation({ summary: 'create a new client' })
    @ApiResponse({ status: 403, description: 'You are not allowed to create client' })
    @ApiResponse({ status: 401, description: 'UnAuthorized.' })
    @ApiResponse({ status: 201, description: 'New client created' })
    async createClient(@Req() req: Request, @Body() body: CreateClientDto) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        if(!this._usernameArray.includes(decodeToken.username)){
            throw new ForbiddenException('You are not allowed to create client');
        }
        return await this.createClientService.createAccount(body.email, body.name);
    }

    @HttpCode(200)
    @ApiOperation({ summary: 'Get client details' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 401, description: 'UnAuthorized.' })
    @ApiResponse({ status: 200, description: 'The found record' })
    @ApiResponse({ status: 404, description: 'Record not found' })
    @Get()
    async getClient(
        @Req() req: Request
    ) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        return await this.clientService.getClient(clientId);
    }

    @HttpCode(200)
    @UseGuards(ManagementAccessGuard)
    @Put('app-settings')
    async updateClientAppSettings(
        @Req() req: Request,
        @Body() clientTaskSubmitTextDto: Partial<ClientTaskSubmitTextDto>
    ) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        return await this.clientService.updateClientAppSettings(clientId,clientTaskSubmitTextDto);
    }

    @HttpCode(200)
    @UseGuards(ManagementAccessGuard)
    @Get('app-settings')
    async getClientAppSettings(
        @Req() req: Request
    ) {
        const decodeToken = req['decodeToken'] as JwtPayloadInterface;
        const clientId = decodeToken.clientId;
        return await this.clientService.getClientAppSettings(clientId);
    }
}

