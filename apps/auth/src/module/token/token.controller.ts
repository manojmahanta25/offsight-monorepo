import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UseInterceptors
} from "@nestjs/common";
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {TransformResponseInterceptor} from "@app/common";
import {TokenService} from "./token.service";


@ApiTags('Token')
@Controller('token')
@UseInterceptors(TransformResponseInterceptor)
export class TokenController {
    constructor(private readonly tokenService:TokenService) {}

    @Post()
    @ApiBody({description:'token', schema:{type:'object',properties:{ token:{ type:'string'}}}, required: true})
    async decodeToken(@Body('token') token:string) {
        if(!token) {
            throw new BadRequestException('Token is required');
        }
        return this.tokenService.decodeToken(token);
    }
}