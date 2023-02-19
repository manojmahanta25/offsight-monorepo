import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateTagGroupDto {
  @ApiProperty({ example: 'TagGroupName' })
  @IsNotEmpty()
  @IsString()
  tag_group_name: string;
}
