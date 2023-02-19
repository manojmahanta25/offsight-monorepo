import { ApiProperty, ApiParam,ApiParamOptions } from '@nestjs/swagger';
import { IsNotEmpty, isNumber, IsString } from 'class-validator';

export class CreateViewDto {
  @ApiProperty({ example: 'ViewName' })
  @IsNotEmpty()
  @IsString()
  feed_view_name: string;
}

export class ViewOrderDto {
  @ApiProperty({ example: 1})
  @IsNotEmpty()
  feed_view_id: number;

  @ApiProperty({ example: 'ViewName' })
  @IsNotEmpty()
  @IsString()
  feed_view_name: string;

  @ApiProperty({ example: 64 })
  @IsNotEmpty()
  client_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  feed_view_order: number;
}



