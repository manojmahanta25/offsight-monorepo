import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { CommonService, TransformResponseInterceptor, AuthGuard } from "@app/common";
import { TagGroupService } from "./tagGroup.service";
import { CreateTagGroupDto } from "./dto/create-tagGroup.dto";

@ApiTags("Tag Group")
@Controller("tag-group")
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class TagGroupController {
  constructor(private readonly tagGroupService: TagGroupService, private commonService: CommonService) {}

  @Get()
  @ApiOperation({ summary: "Gets Tag Groups" })
  @ApiResponse({ status: 200, description: "The found record" })
  getProductTypeGroup(@Req() req: Request) {
    return this.tagGroupService.getAll(this.commonService.getClientId(req));
  }

  @Post()
  @ApiOperation({ summary: "Create Tag Group" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  createTagGroup(@Body() tagGroupDto: CreateTagGroupDto, @Req() req: Request) {
    return this.tagGroupService.createTagGroup(this.commonService.getClientId(req), tagGroupDto);
  }

  @Patch(":tag_group_id")
  @ApiOperation({ summary: "Update Tag Group" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  updateTagGroup(@Param("tag_group_id") tag_group_id: number, @Body() tagGroupDto: CreateTagGroupDto, @Req() req: Request) {
    return this.tagGroupService.updateTagGroup({ tag_group_id, client_id: this.commonService.getClientId(req) }, tagGroupDto);
  }

  @Delete(":tag_group_id")
  @ApiOperation({ summary: "Delete Tag Group" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  deleteTagGroup(@Param("tag_group_id") tag_group_id: number, @Req() req: Request) {
    return this.tagGroupService.deleteTagGroup({
      client_id: this.commonService.getClientId(req),
      tag_group_id,
    });
  }
}
