import { AuthGuard, CommonService, TransformResponseInterceptor } from '@app/common';
import { Body, Controller, Get, Param, Post, Put, Req, UseGuards, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PartGroupsService } from './partGroups.service';
import { Request } from 'express'
import { CreatePartGroupDto, UpdatePartGroupDto } from './dto/partGroup.dto';

const title = 'Part Groups'

@ApiTags(title)
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('part-groups')
export class PartGroupsController {
    constructor(
        private readonly partGroupsService: PartGroupsService,
        private commonService: CommonService
    ) { }

    @Get()
    @ApiOperation({ summary: `Get All ${title}` })
    @ApiResponse({ status: 200, description: 'Successfully found all record' })
    getAllPartGroup(@Req() req: Request) {
        return this.partGroupsService.getAll(this.commonService.getClientId(req));
    }

    @Post()
    @ApiOperation({ summary: `Create ${title}` })
    @ApiResponse({ status: 201, description: "Successfully Create a new record" })
    createPartGroup(@Req() req: Request, @Body() body: CreatePartGroupDto) {
        return this.partGroupsService.createPartGroup(this.commonService.getClientId(req), body.partGroupName)
    }

    @Put(":id")
    @ApiOperation({ summary: `update ${title}` })
    @ApiResponse({ status: 200, description: "Successfully updated record" })
    updatePartGroup(@Param("id", ParseIntPipe) id: number, @Body() body: UpdatePartGroupDto) {
        return this.partGroupsService.updatePartGroup(id, body.partGroupName)
    }


}
