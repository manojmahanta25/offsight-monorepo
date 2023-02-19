import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateProductTypeGroupDto {
  @ApiProperty({ example: 'ProductTypeGroupName' })
  @IsNotEmpty()
  @IsString()
  product_type_group_name: string;
}

export class ProductTypeGroupDto {
  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  product_type_group_id: number;
}

export class ProductTypeGroupOrderArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductTypeGroupDto)
  productTypeGroupOrder: ProductTypeGroupDto[];
}


