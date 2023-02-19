import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { CommonService, TransformResponseInterceptor, AuthGuard } from "@app/common";
import { TaskTypeService } from "./taskType.service";
import { CreateTaskTypeDto, TaskTypeArrayDto } from "./dto/create-taskType.dto";

@ApiTags("Tag")
@Controller("tag")
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class TaskTypeController {
  constructor(private readonly taskTypeService: TaskTypeService, private commonService: CommonService) {}

  @Get()
  @ApiOperation({ summary: "Gets Task Type" })
  @ApiResponse({ status: 200, description: "The found record" })
  getTaskType(@Req() req: Request) {
    return this.taskTypeService.getAll(this.commonService.getClientId(req));
  }

  @Post()
  @ApiOperation({ summary: "Create Task Type" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  createTaskType(@Body() taskTypeDto: CreateTaskTypeDto, @Req() req: Request) {
    return this.taskTypeService.createTaskType(this.commonService.getClientId(req), taskTypeDto);
  }

  @Patch(":task_type_id")
  @ApiOperation({ summary: "Update Task Type" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  updateTaskType(@Param("task_type_id") task_type_id: number, @Body() taskTypeDto: CreateTaskTypeDto, @Req() req: Request) {
    return this.taskTypeService.updateTaskType({ task_type_id, client_id: this.commonService.getClientId(req) }, taskTypeDto);
  }

  @Delete(":task_type_id")
  @ApiOperation({ summary: "Delete Task Type" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  deleteTaskType(@Param("task_type_id") task_type_id: number, @Req() req: Request) {
    return this.taskTypeService.deleteTaskType({
      client_id: this.commonService.getClientId(req),
      task_type_id,
    });
  }

  @Post("/set-order")
  @ApiOperation({ summary: "Set Tag Order" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({ type: TaskTypeArrayDto })
  setTagOrder(@Body() taskTypeOrderDto: TaskTypeArrayDto, @Req() req: Request) {
    return this.taskTypeService.setTaskTypeOrder(taskTypeOrderDto, this.commonService.getClientId(req));
  }
}
