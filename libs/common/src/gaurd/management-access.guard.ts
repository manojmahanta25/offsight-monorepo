import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {JwtPayloadInterface} from "@app/common/interfaces/jwt-payload.interface";

@Injectable()
export class ManagementAccessGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest();
    if(request.decodeToken){
      const payload:JwtPayloadInterface = request.decodeToken as JwtPayloadInterface;
      return payload.userGroupPermission.loginAccessManagementTool;
    }else{
        return false;
    }
  }
}
