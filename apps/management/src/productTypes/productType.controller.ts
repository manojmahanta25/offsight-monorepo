import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { CommonService, TransformResponseInterceptor, AuthGuard } from "@app/common";
import { ProductTypeService } from "./productType.service";
import { CreateProductTypeDto, ProductTypeOrderArrayDto } from "./dto/create-productType.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";

@ApiTags("Product Type")
@Controller("product-type")
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService, private commonService: CommonService) {}

  @Get()
  @ApiOperation({ summary: "Gets Product Type" })
  @ApiResponse({ status: 200, description: "The found record" })
  getProductType(@Req() req: Request) {
    return this.productTypeService.getAll(this.commonService.getClientId(req));
  }

  @Post()
  @ApiOperation({ summary: "Create Product Type" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  createProductType(@Req() req: Request, @Body() productTypeDto: CreateProductTypeDto) {
    return this.productTypeService.createProductType(this.commonService.getClientId(req), productTypeDto);
  }

  @Patch(":product_type_id")
  @ApiOperation({ summary: "Update Product Type" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  updateProductType(@Param("product_type_id") product_type_id: number, @Body() updateProductTypeDto: CreateProductTypeDto, @Req() req: Request) {
    return this.productTypeService.updateProductType({ product_type_id, client_id: this.commonService.getClientId(req) }, updateProductTypeDto);
  }

  @Delete(":product_type_id")
  @ApiOperation({ summary: "Delete Product Type" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  deleteProductType(@Param("product_type_id") product_type_id: number, @Req() req: Request) {
    return this.productTypeService.deleteProductType({
      client_id: this.commonService.getClientId(req),
      product_type_id,
    });
  }

  @Post("/set-order")
  @ApiOperation({ summary: "Set Product Type Order" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({ type: ProductTypeOrderArrayDto })
  setProductTypeOrder(@Body() productTypeOrderDto: ProductTypeOrderArrayDto, @Req() req: Request) {
    return this.productTypeService.setProductTypeOrder(productTypeOrderDto, this.commonService.getClientId(req));
  }

  @Post("upload-image/:product_type_id")
  @ApiOperation({ summary: "Upload Product Type Image" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes("image")) {
          return callback(new BadRequestException("Provide a valid image"), false);
        }
        callback(null, true);
      },
      limits: {
        files: 1,
      },
    }),
  )
  async addAvatar(@Param("product_type_id") product_type_id: number, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) throw new BadRequestException("Please select a valid image");
    return this.productTypeService.addAvatar(product_type_id, this.commonService.getClientId(req), file.originalname, file.buffer);
  }

  @Post("remove-image/:product_type_id")
  @ApiOperation({ summary: "Remove Product Type Image" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async deleteAvatar(@Param("product_type_id") product_type_id: number, @Req() req: Request) {
    return this.productTypeService.deleteAvatar(product_type_id, this.commonService.getClientId(req));
  }

  @Post('set-parent/:product_type_id')
  @ApiOperation({ summary: 'Remove Product Type Image' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async setParent(){
    // condition API will work only when product are added and in the live screen
    // product_type_id != parent_product_type_id
    // parent can only be set more than 10 times product_type_id
    // if  product's parent  can not be set its parent
    

  }

}
