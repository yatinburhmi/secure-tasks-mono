import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  ParseUUIDPipe,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import { TasksBackendService } from '@secure-tasks-mono/tasks-backend';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskDto,
  FindAllTasksFiltersDto,
  FindAllTasksQueryDto,
} from '@secure-tasks-mono/data';
// User as UserEntity is not strictly needed if JwtPayload contains all necessary fields like organizationId
// import { User as UserEntity } from '@secure-tasks-mono/database';
import {
  PermissionsGuard,
  RequirePermissions,
  PERM_TASK_CREATE,
  PERM_TASK_UPDATE,
  PERM_TASK_DELETE,
  PERM_TASK_VIEW_ALL_ORGS,
  JwtPayload, // Imported JwtPayload
} from '@secure-tasks-mono/auth';

// Removed AuthenticatedRequest interface, will use JwtPayload directly for req.user

@Controller('tasks')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class TasksController {
  constructor(private readonly tasksBackendService: TasksBackendService) {}

  @Post()
  @HttpCode(201)
  @RequirePermissions(PERM_TASK_CREATE)
  public async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: { user: JwtPayload } // Typed req.user as JwtPayload
  ): Promise<TaskDto> {
    const user = req.user; // user is JwtPayload

    if (createTaskDto.organizationId !== user.organizationId) {
      throw new ForbiddenException(
        'You can only create tasks for your own organization.'
      );
    }

    console.log('Creating task with userId:', user.sub);

    const createdTask = await this.tasksBackendService.createTask(
      createTaskDto,
      user.sub // Used user.sub for userId
    );
    return createdTask as unknown as TaskDto;
  }

  @Get()
  public async findAllTasks(
    @Req() req: { user: JwtPayload },
    @Query() query: FindAllTasksQueryDto
  ): Promise<TaskDto[]> {
    const user = req.user;

    const filters: FindAllTasksFiltersDto = {};
    if (query.assigneeId) {
      filters.assigneeId = query.assigneeId;
    }

    const tasks = await this.tasksBackendService.findAllTasks(
      user.organizationId,
      filters,
      query.searchTerm
    );
    return tasks as unknown as TaskDto[];
  }

  @Get('all-organizations')
  @RequirePermissions(PERM_TASK_VIEW_ALL_ORGS)
  public async findAllTasksAcrossOrganizations(
    @Query() query: FindAllTasksQueryDto
  ): Promise<TaskDto[]> {
    const tasks =
      await this.tasksBackendService.findAllTasksAcrossOrganizations(
        query.searchTerm
      );
    return tasks as unknown as TaskDto[];
  }

  @Get(':id')
  public async findTaskById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: JwtPayload } // Typed req.user as JwtPayload
  ): Promise<TaskDto> {
    const user = req.user; // user is JwtPayload
    const task = await this.tasksBackendService.findTaskById(
      id,
      user.organizationId
    );
    return task as unknown as TaskDto;
  }

  @Patch(':id')
  @RequirePermissions(PERM_TASK_UPDATE)
  public async updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: { user: JwtPayload } // Typed req.user as JwtPayload
  ): Promise<TaskDto> {
    const user = req.user; // user is JwtPayload

    if (
      updateTaskDto.organizationId &&
      updateTaskDto.organizationId !== user.organizationId
    ) {
      throw new ForbiddenException(
        'Cannot change the organization of a task or assign to a different organization.'
      );
    }
    const { organizationId, ...restOfUpdateDto } = updateTaskDto;
    if (organizationId && organizationId !== user.organizationId) {
      throw new ForbiddenException('Task organization cannot be changed.');
    }

    const updatedTask = await this.tasksBackendService.updateTask(
      id,
      restOfUpdateDto as UpdateTaskDto,
      user.organizationId,
      user.sub
    );
    return updatedTask as unknown as TaskDto;
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermissions(PERM_TASK_DELETE)
  public async deleteTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: JwtPayload } // Typed req.user as JwtPayload
  ): Promise<void> {
    const user = req.user; // user is JwtPayload
    await this.tasksBackendService.deleteTask(
      id,
      user.organizationId,
      user.sub
    );
  }
}
