import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { CommonService, TransformResponseInterceptor, AuthGuard } from "@app/common";
import { TagService } from "./tag.service";
import { CreateTagDto, TagArrayDto } from "./dto/create-tag.dto";

@ApiTags("Tag")
@Controller("tag")
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class TagController {
  constructor(private readonly tagService: TagService, private commonService: CommonService) {}

  @Get()
  @ApiOperation({ summary: "Gets Tag" })
  @ApiResponse({ status: 200, description: "The found record" })
  getTags(@Req() req: Request) {
    return this.tagService.getAll(this.commonService.getClientId(req));
  }

  @Post()
  @ApiOperation({ summary: "Create Tag" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  createTag(@Body() tagDto: CreateTagDto, @Req() req: Request) {
    return this.tagService.createTag(this.commonService.getClientId(req), tagDto);
  }

  @Patch(":tag_id")
  @ApiOperation({ summary: "Update Tag" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  updateTag(@Param("tag_id") tag_id: number, @Body() tagDto: CreateTagDto, @Req() req: Request) {
    return this.tagService.updateTag({ tag_id, client_id: this.commonService.getClientId(req) }, tagDto);
  }

  @Delete(":tag_id")
  @ApiOperation({ summary: "Delete Tag" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  deleteTag(@Param("tag_id") tag_id: number, @Req() req: Request) {
    return this.tagService.deleteTag({
      client_id: this.commonService.getClientId(req),
      tag_id,
    });
  }

  @Post("/set-order")
  @ApiOperation({ summary: "Set Tag Order" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({ type: TagArrayDto })
  setTagOrder(@Body() tagOrderDto: TagArrayDto, @Req() req: Request) {
    return this.tagService.setTagOrder(tagOrderDto, this.commonService.getClientId(req));
  }
}
