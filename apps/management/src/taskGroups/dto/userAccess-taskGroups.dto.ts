import { userGroupValidator } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, ArrayNotEmpty, IsArray, IsEnum, IsNumber, Validate, ValidateNested } from 'class-validator';

export class ContextAwareDto {
  @Allow()
  context?: {
    decodeToken: any;
  };
}

export class UserAccessTaskGroupDto extends ContextAwareDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  task_group_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Validate(userGroupValidator)
  user_group_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsEnum({0:0,1:1,2:2,3:3})
  is_alert_enabled: number;

}

export class UserAccessTaskGroupArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UserAccessTaskGroupDto)
  taskGroupAccessMapping: UserAccessTaskGroupDto[];
}
