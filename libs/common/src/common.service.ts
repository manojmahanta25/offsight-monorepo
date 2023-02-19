import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { JwtPayloadInterface } from "@app/common/interfaces/jwt-payload.interface";

@Injectable()
export class CommonService {
  getClientId(req: Request) {
    const decodeToken = req["decodeToken"] as JwtPayloadInterface;
    return decodeToken.clientId;
  }

  getClientGroupId(req: Request) {
    const decodeToken = req["decodeToken"] as JwtPayloadInterface;
    return decodeToken.userGroupId;
  }

  getUserDecodedData() {
    return "fdgfdgdfg";
  }
}
