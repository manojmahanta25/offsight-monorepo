import { PartGroupModel } from '@app/model/Management/partGroup.model';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PartGroupsService {
    constructor(
        @Inject('PartGroupModelRepository') private partGroupModel: typeof PartGroupModel,
    ) { }

    getAll(clientId: number) {
        return this.partGroupModel.findAll({
            where: {
                is_active: true,
                client_id: clientId
            }
        })
    }

    createPartGroup(clientId: number, partGroupName: string) {
        return this.partGroupModel.create({
            client_id: clientId,
            part_group_name: partGroupName
        })
    }

    async updatePartGroup(id: number, partGroupName: string) {
        await this.partGroupModel.update({
            part_group_name: partGroupName
        }, {
            where: {
                part_group_id: id
            }
        })

        return this.partGroupModel.findByPk(id);
    }

}
