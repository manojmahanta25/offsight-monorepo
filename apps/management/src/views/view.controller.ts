import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { TransformResponseInterceptor } from "@app/common";
import { ViewService } from "./view.service";
import { CreateViewDto, ViewOrderDto } from "./dto/create-view.dto";
import { AuthGuard } from "@app/common/gaurd/auth.guard";
import { ExcelService } from "@app/common/excel/excel.service";
import { CommonService } from "@app/common/common.service";

@ApiTags("Views")
@Controller("views")
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class ViewController {
  constructor(private readonly viewService: ViewService, private excelService: ExcelService, private readonly commonService: CommonService) {}

  @Get()
  @ApiOperation({ summary: "Gets Views" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 200, description: "The found record" })
  getViews(@Req() req: Request) {
    return this.viewService.getAll(this.commonService.getClientId(req));
  }



  @Post()
  @ApiOperation({ summary: "Create View" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  createView(@Body() createViewDto: CreateViewDto, @Req() req: Request) {
    return this.viewService.createView(this.commonService.getClientId(req), this.commonService.getClientGroupId(req), createViewDto);
  }

  @Post("/set-order")
  @ApiOperation({ summary: "Set View Order" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({ type: [ViewOrderDto] })
  setViewOrder(@Body() viewOrderDto: ViewOrderDto[], @Req() req: Request) {
    return this.viewService.setViewOrder(viewOrderDto, this.commonService.getClientId(req));
  }

  @Patch(":feed_view_id")
  @ApiOperation({ summary: "Update View" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  updateView(@Param("feed_view_id") feed_view_id: number, @Body() updateViewDto: CreateViewDto, @Req() req: Request) {
    return this.viewService.updateView({ feed_view_id, client_id: this.commonService.getClientId(req) }, updateViewDto);
  }

  @Delete(":feed_view_id")
  @ApiOperation({ summary: "Update View" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  deleteView(@Param("feed_view_id") feed_view_id: number, @Req() req: Request) {
    return this.viewService.deleteView({
      client_id: this.commonService.getClientId(req),
      feed_view_id,
    });
  }

  @Get("/download")
  @ApiOperation({ summary: "Gets Views" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 200, description: "The found record" })
  downloadViewExel(@Req() req: Request) {
    return this.viewService.downoadExcel(this.commonService.getClientId(req));
  }

  @Get('/group-setting')
  @ApiOperation({ summary: "Gets Views User Group Settings" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 200, description: "The found record" })
  async getViewUserGroupSetting(@Req() req: Request) {
    return await this.viewService.getAllUserGroupSetting(this.commonService.getClientId(req));
  }

  @Post("group-setting/:feed_view_id")
  @ApiOperation({ summary: "Update View User Group Setting" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({ type: [Number] })
  updateUserGroup(@Param("feed_view_id") feed_view_id: number, @Body() group_ids: number[], @Req() req: Request) {
    return this.viewService.updateViewGroupAccess({ feed_view_id, client_id: this.commonService.getClientId(req) }, group_ids);
  }
}
