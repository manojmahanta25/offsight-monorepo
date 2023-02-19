import {Test, TestingModule} from '@nestjs/testing';
import {ClientService} from './client.service';
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";

describe('ClientService', () => {
    let service: ClientService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ClientService],
        }).useMocker(ModelMockerFunction).compile();

        service = module.get<ClientService>(ClientService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get client', async () => {
        const result = service.getClient(1)
        await expect(result).resolves.not.toBeNull();
    });

    it('should get client app settings', async () => {
        const result = service.getClientAppSettings(1)
        await expect(result).resolves.not.toBeNull();
    });

    it('should update client app settings', async () => {
        const payload = {
            excelColumnsNames: 'test',
        }
        const result = service.updateClientAppSettings(1, payload);
        await expect(result).resolves.not.toBeNull();

    });
});
