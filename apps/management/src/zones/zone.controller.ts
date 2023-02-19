import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CommonService, TransformResponseInterceptor, AuthGuard, ExcelService } from '@app/common';
import { ZoneService } from './zone.service';
import { CreateZoneDto, ZoneOrderArrayDto } from './dto/create-zone.dto';
import { PlaceZoneDto } from './dto/place-zone.dto';

@ApiTags('Zones')
@Controller('zones')
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class ZoneController {
  constructor(
    private readonly zoneService: ZoneService,
    private excelService: ExcelService,
    private readonly commonService: CommonService,
  ) {
  }

  @Get()
  @ApiOperation({ summary: 'Gets Zones' })
  @ApiResponse({ status: 200, description: 'The found record' })
  getZones(@Req() req: Request) {
    return this.zoneService.getAll(this.commonService.getClientId(req));
  }


  @Post()
  @ApiOperation({ summary: 'Create Zone' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createZone(@Body() createZoneDto: CreateZoneDto, @Req() req: Request) {
    return this.zoneService.createZone(this.commonService.getClientId(req), createZoneDto);
  }


  @Patch(':client_zone_id')
  @ApiOperation({ summary: 'Update Zone' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateZone(
    @Param('client_zone_id') client_zone_id: number,
    @Body() updateZoneDto: CreateZoneDto,
    @Req() req: Request,
  ) {
    return this.zoneService.updateZone(
      { client_zone_id, client_id: this.commonService.getClientId(req) },
      updateZoneDto,
    );
  }

  @Post('/set-order')
  @ApiOperation({ summary: 'Set Zone Order' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: ZoneOrderArrayDto })
  async setZoneOrder(@Body() zoneOrderDto: ZoneOrderArrayDto, @Req() req: Request) {
    return this.zoneService.setZoneOrder(
      zoneOrderDto, 
      this.commonService.getClientId(req)
    );
  }

  @Delete(':client_zone_id')
  @ApiOperation({ summary: 'Delete Zone' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteZone(@Param('client_zone_id') client_zone_id: number, @Req() req: Request) {
    return this.zoneService.deleteZone({
      client_id: this.commonService.getClientId(req),
      client_zone_id,
    });
  }

  @Get('/download')
  @ApiOperation({ summary: 'Gets Zones' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async downloadZoneExel(@Req() req: Request) {
    const data = await this.zoneService.getAll(this.commonService.getClientId(req));
    const headers = [
      {key:'client_zone_name',value:"Zone Names"},
      {key:'feed_view_name',value:"View Name"},
      {key:'client_zone_barcode_id',value:"Zone Barcode"},
      {key:'client_zone_order',value:"ID	Zone Order"}
    ];	 
    return this.excelService.downloadExcel(data, headers,"zone.xlsx");
  }

  @Post('/update-zone-place')
  @ApiOperation({ summary: 'Update Zones Place' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: PlaceZoneDto })
  async updateZonePlace(@Body() placeZoneDto : PlaceZoneDto, @Req() req: Request) {
    return this.zoneService.updateZonePlace(placeZoneDto, this.commonService.getClientId(req));
  }

  @Get('/get-zone-by-view/:view_id')
  @ApiOperation({ summary: 'Get Zone By View' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getZoneByView(@Param('view_id') view_id: number, @Req() req: Request) {
    return this.zoneService.getZoneByView(view_id, this.commonService.getClientId(req));
  }

}
