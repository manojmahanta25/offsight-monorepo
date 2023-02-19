import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class CreateTaskTypeDto {
  @ApiProperty({ example: "TaskTypeName" })
  @IsNotEmpty()
  @IsString()
  task_type_name: string;
}

export class TaskTypeDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  task_type_id: number;
}

export class TaskTypeArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TaskTypeDto)
  taskTypeOrder: TaskTypeDto[];
}
