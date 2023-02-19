import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateZoneDto {
  @ApiProperty({ example: 'ZoneName' })
  @IsNotEmpty()
  @IsString()
  client_zone_name: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  @IsNumber()
  feed_view_id: string;

  @ApiProperty({ example: 'BarCode' })
  @IsString()
  client_zone_barcode_id: string;
}

export class ZoneOrderDto {
  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  client_zone_id: number;
}

export class ZoneOrderArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ZoneOrderDto)
  zoneOrder: ZoneOrderDto[];
}