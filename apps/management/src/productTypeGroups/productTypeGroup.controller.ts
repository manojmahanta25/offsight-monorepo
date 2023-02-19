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
import { CommonService, TransformResponseInterceptor, AuthGuard} from '@app/common';
import { ProductTypeGroupService } from './productTypeGroup.service';
import { CreateProductTypeGroupDto, ProductTypeGroupOrderArrayDto } from './dto/create-productTypeGroup.dto';


@ApiTags('Product Type Group')
@Controller('product-type-group')
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class ProductTypeGroupController {
  constructor(
    private readonly productTypeGroupService: ProductTypeGroupService,
    private commonService: CommonService
  ) {
  }

  @Get()
  @ApiOperation({ summary: 'Gets Product Type Groups' })
  @ApiResponse({ status: 200, description: 'The found record' })
  getProductTypeGroup(@Req() req: Request) {
    return this.productTypeGroupService.getAll(this.commonService.getClientId(req));
  }


  @Get('/download')
  @ApiOperation({ summary: 'Download Product Type Group Excel' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: ProductTypeGroupOrderArrayDto })
  async downloadExcel(@Req() req: Request) {
    return await this.productTypeGroupService.downloadExcel(this.commonService.getClientId(req));
  }

  @Post()
  @ApiOperation({ summary: 'Create Product Type Group' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createProductTypeGroup(@Body() productTypeGroupDto: CreateProductTypeGroupDto, @Req() req: Request) {
    return this.productTypeGroupService.createProductTypeGroup(this.commonService.getClientId(req), productTypeGroupDto);
  }

  @Patch(':product_type_group_id')
  @ApiOperation({ summary: 'Update Product Type Group' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateProductTypeGroup(
    @Param('product_type_group_id') product_type_group_id: number,
    @Body() updateProductTypeGroupDto: CreateProductTypeGroupDto,
    @Req() req: Request,
  ) {
    return this.productTypeGroupService.updateProductTypeGroup(
      { product_type_group_id, client_id: this.commonService.getClientId(req) },
      updateProductTypeGroupDto,
    );
  }

  @Delete(':product_type_group_id')
  @ApiOperation({ summary: 'Delete Product Type Group' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteProductTypeGroup(@Param('product_type_group_id') product_type_group_id: number, @Req() req: Request) {
    return this.productTypeGroupService.deleteProductTypeGroup({
      client_id: this.commonService.getClientId(req),
      product_type_group_id,
    });
  }

  @Post('/set-order')
  @ApiOperation({ summary: 'Set Product Type Group Order' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: ProductTypeGroupOrderArrayDto })
  setProductTypeGroupOrder(@Body() productTypeGroupOrderDto: ProductTypeGroupOrderArrayDto, @Req() req: Request) {
    return this.productTypeGroupService.setProductTypeGroupOrder(productTypeGroupOrderDto, this.commonService.getClientId(req));
  }

  @Get('/user-group')
  @ApiOperation({ summary: 'Get Product Type Group User Group Setting' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getProductTypeUserGroupMapping(@Req() req: Request) {
    return this.productTypeGroupService.getProductTypeGroupAndUserGroup(this.commonService.getClientId(req));
  }


}
