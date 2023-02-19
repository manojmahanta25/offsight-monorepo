import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {ClientTaskSubmitTextDto} from "./client.dto";
import {ClientAppSettingsModel} from "@app/model/Client/client-app-settings.model";
import {ClientModel} from "@app/model/Client/client.model";

@Injectable()
export class ClientService {
    constructor(
        @Inject('ClientModelRepository') private clientModel: typeof ClientModel,
        @Inject('ClientAppSettingsModelRepository') private clientAppSettingsModel: typeof ClientAppSettingsModel,
    ) {
    }

    getClient(clientId: number): Promise<ClientModel> {
        return this.clientModel.findOne({where: {id: clientId}});
    }

    getClientAppSettings(clientId: number): Promise<ClientAppSettingsModel> {
        return this.clientAppSettingsModel.findOne({where: {clientId: clientId}});
    }

    updateClientAppSettings(clientId: number, clientAppSettings: Partial<ClientAppSettingsModel>): Promise<ClientAppSettingsModel> {
        const update = this.clientAppSettingsModel.update(clientAppSettings, {
            where: {clientId: clientId}
        });
        if (update[0] === 0) {
            throw new NotFoundException('User Group not found');
        }
        return this.clientAppSettingsModel.findOne({where: {clientId: clientId}});
    }
}
