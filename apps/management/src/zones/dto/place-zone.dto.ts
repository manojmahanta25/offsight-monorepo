import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class ZonePlaceDto {
  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  client_zone_id: number;
  
  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  position_x: number;

  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  position_y: number;
  
  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @ApiProperty({ example: 'ZoneName' })
  @IsNotEmpty()
  @IsString()
  client_zone_color: string;

  @ApiProperty({ example: 1.5 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  client_zone_text_size: number;

}

export class PlaceZoneDto {
  
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ZonePlaceDto)
  zones: ZonePlaceDto[];

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  view_all: string;

}

