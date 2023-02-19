import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {HeadersEnum} from "@app/common/enums/headers.enum";
import {TokenService} from "../module/token/token.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private tokenService: TokenService) {
    }

    async canActivate(
        context: ExecutionContext,
    ) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies[HeadersEnum.AUTH_TOKEN];
        if (!token) {
            throw new UnauthorizedException()
        }

        const decoded = await this.tokenService.decodeToken(token);
        if (!decoded) {
            throw new UnauthorizedException();
        }
        request.decodeToken = decoded;
        return true;

    }
}