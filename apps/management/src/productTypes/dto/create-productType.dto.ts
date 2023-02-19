import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Validate, ValidateNested } from 'class-validator';
import { productTypeGroupValidator, zoneValidation } from '@app/common';

export class CreateProductTypeDto {
  @ApiProperty({ example: 'ProductTypeName' })
  @IsNotEmpty()
  @IsString()
  product_type_name: string;

  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  @Validate(productTypeGroupValidator)
  product_type_group_id: number;

  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  @Validate(zoneValidation)
  product_type_default_zone_id: number
}

export class ProductTypeDto {
  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  product_type_id: number;
}

export class ProductTypeOrderArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductTypeDto)
  productTypeOrder: ProductTypeDto[];
}


