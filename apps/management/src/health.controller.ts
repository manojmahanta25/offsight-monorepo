import {Controller, Get, Req, UseGuards, VERSION_NEUTRAL} from "@nestjs/common";
import { HealthCheckService, HttpHealthIndicator, HealthCheck, SequelizeHealthIndicator } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from '@app/common'

@ApiTags('Health')
@Controller({
    path: 'health',
    version: VERSION_NEUTRAL,
})
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private db: SequelizeHealthIndicator,
        private mail: MailService
    ) {
    }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
            () => this.db.pingCheck('offsight_prodtouatj'),
        ]);
    }

    @Get('helloWorld')
    async helloWorld() {
        await this.mail.mailWithAttachment()
        return 'Hello World';
    }

}
