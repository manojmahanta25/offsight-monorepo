import {Module} from '@nestjs/common';
import {ClientController} from './client.controller';
import {ClientService} from './client.service';
import {CreateClientService} from "./create-client.service";
import {ShareModule} from "../common/share.module";

@Module({
    imports: [ShareModule],
    controllers: [ClientController],
    providers: [ClientService, CreateClientService]
})
export class ClientModule {
}
