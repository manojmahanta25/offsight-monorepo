import { AuthGuard, CommonService, TransformResponseInterceptor } from "@app/common";
import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { CreateTaskGroupDto, TaskGroupArrayDto } from "./dto/create-taskGroups.dto";
import { UserAccessTaskGroupArrayDto } from "./dto/userAccess-taskGroups.dto";
import { TaskGroupService } from "./taskGroups.service";

@ApiTags("Task Group")
@Controller("task-group")
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class TaskGroupController {
  constructor(private readonly taskGroupService: TaskGroupService, private commonService: CommonService) { }

  @Get()
  @ApiOperation({ summary: "Gets Task Groups" })
  @ApiResponse({ status: 200, description: "The found record" })
  getTaskGroup(@Req() req: Request) {
    return this.taskGroupService.getAll(this.commonService.getClientId(req));
  }

  @Post()
  @ApiOperation({ summary: "Create  Task Group" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  createTaskGroup(@Body() taskGroupDto: CreateTaskGroupDto, @Req() req: Request) {
    return this.taskGroupService.createTaskGroup(this.commonService.getClientId(req), taskGroupDto);
  }

  @Patch(":task_group_id")
  @ApiOperation({ summary: "Update Task Group" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  updateTaskGroup(@Param("task_group_id") task_group_id: number, @Body() taskGroupDto: CreateTaskGroupDto, @Req() req: Request) {
    return this.taskGroupService.updateTaskGroup({ task_group_id, client_id: this.commonService.getClientId(req) }, taskGroupDto);
  }

  @Post("/set-order")
  @ApiOperation({ summary: "Set Task Group Order" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({ type: TaskGroupArrayDto })
  setTaskGroupOrder(@Body() taskGroupOrderDto: TaskGroupArrayDto, @Req() req: Request) {
    return this.taskGroupService.setTaskGroupOrder(taskGroupOrderDto, this.commonService.getClientId(req));
  }

  @Get("/group-access-settings")
  @ApiOperation({ summary: "Get Task Group User Access" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  getTaskGroupUserAccess(@Req() req: Request) {
    return this.taskGroupService.getTaskGroupUserAccess(this.commonService.getClientId(req));
  }

  @Post("/group-access-settings")
  @ApiOperation({ summary: "Set Task Group User Access" })
  @ApiResponse({ status: 403, description: "Forbidden." })
  setTaskGroupUserAccess(@Body() userAccessTaskGroupArrayDto: UserAccessTaskGroupArrayDto, @Req() req: Request) {
    return this.taskGroupService.setTaskGroupUserAccess(userAccessTaskGroupArrayDto, this.commonService.getClientId(req));
  }

  // @Delete(':task_group_id')
  // @ApiOperation({ summary: 'Delete Task Group' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // deleteTaskGroup(@Param('task_group_id') task_group_id: number) {
  //   return this.taskGroupService.deleteTaskGroup({
  //     task_group_id,
  //   });
  // }
}
