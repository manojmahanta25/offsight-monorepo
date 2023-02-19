import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  tag_group_id: number;

  @ApiProperty({ example: 'TagName' })
  @IsNotEmpty()
  @IsString()
  tag_title:string;

  @ApiProperty({ example: 'TagDescription' })
  @IsNotEmpty()
  @IsString()
  tag_description:string;
}

export class TagDto {
  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  tag_id: number;
}

export class TagArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tagOrder: TagDto[];
}