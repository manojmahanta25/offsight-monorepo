import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { ViewModel, ZoneModel, ZoneToViewModel } from "@app/model";
import { Op, QueryTypes } from "sequelize";

@Injectable()
export class ZoneService {
  constructor(
    @Inject("ViewModelRepository") private viewModel: typeof ViewModel,
    @Inject("ZoneModelRepository") private zoneModel: typeof ZoneModel,
    @Inject("ZoneToViewModelRepository") private zoneToViewModel: typeof ZoneToViewModel,
  ) {}

  async getAll(client_id: number): Promise<any> {
    const getZoneQuery = `SELECT z.*, v.feed_view_names  FROM zones z 
    INNER JOIN zones_to_views ztv ON z.client_zone_id = ztv.client_zone_id 
    INNER JOIN views v ON ztv.feed_view_id  = v.feed_view_id 
    WHERE z.client_zone_is_active = 1 AND z.client_id = "${client_id}"
    ORDER BY z.client_zone_order ASC;`;
    return await this.zoneModel.sequelize.query(getZoneQuery, { type: QueryTypes.SELECT });
    // return this.zoneModel.findAll({
    //   // include: [zoneToView],
    //   order: [['client_zone_order', 'ASC']],
    //   where: { client_zone_is_active: true, client_id }
    // });
  }

  async createZone(client_id: number, createZoneDto): Promise<any> {
    await this.getViewByID(createZoneDto.feed_view_id);
    const zoneResp = await this.zoneModel.create({
      client_id: client_id,
      client_zone_name: createZoneDto.client_zone_name,
      client_zone_barcode_id: createZoneDto.client_zone_barcode_id,
    });
    if (zoneResp)
      await this.zoneToViewModel.create({
        client_zone_id: zoneResp.client_zone_id,
        feed_view_id: createZoneDto.feed_view_id,
      });

    return zoneResp;
  }

  async updateZone({ client_zone_id, client_id }, updateZoneDto): Promise<any> {
    await this.getZoneByID(client_zone_id);
    await this.getViewByID(updateZoneDto.feed_view_id);

    const result = await this.zoneModel.findOne({
      where: {
        client_id: client_id,
        client_zone_name: {
          [Op.like]: `%${updateZoneDto.client_zone_name}%`,
        },
        client_zone_id: { [Op.not]: client_zone_id },
      },
    });
    if (result) throw new BadRequestException("Zome name already exist");

    await this.zoneModel.update(
      {
        client_zone_name: updateZoneDto.client_zone_name,
        client_zone_barcode_id: updateZoneDto.client_zone_barcode_id,
      },
      { where: { client_zone_id, client_id } },
    );
    await this.zoneToViewModel.update({ feed_view_id: updateZoneDto.feed_view_id }, { where: { client_zone_id } });
    return this.zoneModel.findByPk(client_zone_id);
  }

  async setZoneOrder(data, client_id): Promise<any> {
    const countZones = await this.getZoneCount(client_id);
    if (countZones != data.zoneOrder.length) throw new BadRequestException("zoneOrder count must be a equal to number of zones");

    for (let index = 0; index < data.zoneOrder.length; index++) {
      let element = data.zoneOrder[index];
      element["client_zone_order"] = index + 1;
    }
    await this.zoneModel.bulkCreate(data.zoneOrder, {
      updateOnDuplicate: ["client_zone_order"],
    });

    return this.getAll(client_id);
  }

  async getZoneCount(client_id) {
    return await this.zoneModel.count({
      where: {
        client_zone_is_active: 1,
        client_id: client_id,
      },
    });
  }

  async updateZonePlace(placeZoneDto, client_id) {
    let keys = ["position_x", "position_y", "width", "height", "client_zone_color", "client_zone_text_size"];
    if (placeZoneDto.view_all) {
      placeZoneDto.zones.map(element => {
        element["view_all_position_x"] = element.position_x;
        element["view_all_position_y"] = element.position_y;
        element["view_all_width"] = element.width;
        element["view_all_height"] = element.height;
        element["view_all_client_zone_color"] = element.client_zone_color;
        element["view_all_client_zone_text_size"] = element.client_zone_text_size;
        keys.forEach(e => delete element[e]);
        return element;
      });
      await this.zoneModel.bulkCreate(placeZoneDto.zones, {
        updateOnDuplicate: ["view_all_position_x", "view_all_position_y", "view_all_width", "view_all_height", "view_all_client_zone_color", "view_all_client_zone_text_size"],
      });
    } else {
      await this.zoneModel.bulkCreate(placeZoneDto.zones, {
        updateOnDuplicate: ["position_x", "position_y", "width", "height", "client_zone_color", "client_zone_text_size"],
      });
    }
    return this.getAll(client_id);
  }

  async deleteZone({ client_zone_id, client_id }): Promise<number[]> {
    return await this.zoneModel.update({ client_zone_is_active: false }, { where: { client_zone_id, client_id } });
  }

  async getZoneByView(view_id, client_id) {
    const getZoneQuery = `SELECT z.*, v.feed_view_name  FROM zones z 
    INNER JOIN zones_to_views ztv ON z.client_zone_id = ztv.client_zone_id 
    INNER JOIN views v ON ztv.feed_view_id  = v.feed_view_id 
    WHERE z.client_zone_is_active = 1 AND z.client_id = ${client_id} AND v.feed_view_id = ${view_id}
    ORDER BY z.client_zone_order ASC;`;
    return await this.zoneModel.sequelize.query(getZoneQuery, { type: QueryTypes.SELECT });
  }

  async getZoneByID(client_zone_id: number) {
    const zone = await this.zoneModel.findByPk(client_zone_id);
    if (!zone) throw new BadRequestException("Unable to find Zone");
    return zone;
  }

  async getViewByID(view_id: number) {
    const view = await this.viewModel.findByPk(view_id);
    if (!view) throw new BadRequestException("Unable to find View");
    return view;
  }
}
