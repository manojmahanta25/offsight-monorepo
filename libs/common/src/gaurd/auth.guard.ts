import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException, GatewayTimeoutException
} from '@nestjs/common';
import { EventEmitter2} from "@nestjs/event-emitter";
import { KafkaProducer } from "@app/config";
import { HeadersEnum} from "@app/common/enums/headers.enum";
import { JwtPayloadInterface} from "@app/common/interfaces/jwt-payload.interface";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private eventEmitter: EventEmitter2,
                private kafkaProducer: KafkaProducer,
    ) {
    }

    async canActivate(
        context: ExecutionContext,
    ) {
        const request = context.switchToHttp().getRequest();
        let token: string;
        token = request.cookies[HeadersEnum.AUTH_TOKEN] || request.headers[HeadersEnum.AUTH_TOKEN]
        if (!token) {
            throw new UnauthorizedException()
        }

        const flag = await this.validate(request, token);
        if (flag == 0) {
             // request.decodeToken = await this.httpValidate(request, token);
             // return true;
            throw new GatewayTimeoutException()
        } else if (flag == 2) {
            throw new UnauthorizedException()
        }
        return true;
    }

    async validate(request: any, token: string): Promise<number> {
        let output = 0;
        await this.kafkaProducer.sendMessage("token-topic", [{value: token, key: token}]);
        return new Promise(resolve => {
            this.eventEmitter.on(`token-${token}`, (data) => {
                this.eventEmitter.removeAllListeners(`token-${token}`);
                const message = JSON.parse(data);
                if (message.status === 200) {
                    request.decodeToken = message.data as JwtPayloadInterface;
                    output = 1;
                } else {
                    output = 2;
                }
                resolve(output);
            });
            setTimeout(() => {
                if (output == 0) {
                    this.eventEmitter.removeAllListeners(`token-${token}`);
                    resolve(output);
                }
            }, 1000 * 10)
        });
    }

    // async httpValidate(request: any, token: string) {
    //
    //     const data = await lastValueFrom(this.httpService.post<any>('http://localhost:3000/api/auth/token', {token: token}).pipe(catchError((error: AxiosError) => {
    //             throw new UnauthorizedException();
    //         }),
    //         map((response) => {
    //             return response.data;
    //         })
    //     ));
    //     return data;
    // }

}