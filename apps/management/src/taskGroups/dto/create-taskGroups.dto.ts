import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateTaskGroupDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  task_type_id: number| null;

  @ApiProperty({ example: 'TaskGroupName' })
  @IsNotEmpty()
  @IsString()
  task_group_name:string;

  @ApiProperty({ example: true })
  @IsBoolean()
  autofill_task_form:string;
  
  @ApiProperty({ example: true })
  @IsBoolean()
  move_to_zone:string;
  
  @ApiProperty({ example: true })
  @IsBoolean()
  skip_percentage:string;
}

export class TaskGroupDto {
  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  task_group_id: number;
}

export class TaskGroupArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TaskGroupDto)
  taskGroupOrder: TaskGroupDto[];
}