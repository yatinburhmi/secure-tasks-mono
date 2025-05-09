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
  Req, // To access the request object for req.user
  ForbiddenException,
} from '@nestjs/common';
import { TasksBackendService } from '@secure-tasks-mono/tasks-backend';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto, UpdateTaskDto, TaskDto } from '@secure-tasks-mono/data';
import { User as UserEntity } from '@secure-tasks-mono/database'; // For typehinting req.user

// Define a type for the authenticated user object on the request
interface AuthenticatedRequest extends Request {
  user: UserEntity & { id: string; organizationId: string; roleId: number };
}

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksBackendService: TasksBackendService) {}

  @Post()
  @HttpCode(201)
  public async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: AuthenticatedRequest
  ): Promise<TaskDto> {
    // Returning TaskDto
    const user = req.user;

    // Ensure task is created within the user's organization
    if (createTaskDto.organizationId !== user.organizationId) {
      throw new ForbiddenException(
        'You can only create tasks for your own organization.'
      );
    }

    // The service's createTask method expects creatorId as a separate param
    const createdTask = await this.tasksBackendService.createTask(
      createTaskDto,
      user.id
    );
    // TODO: Map entity to TaskDto if they are not identical or if selective field exposure is needed.
    // For now, assuming direct compatibility or implicit transformation by NestJS.
    return createdTask as unknown as TaskDto; // Cast if service returns entity
  }

  @Get()
  public async findAllTasks(
    @Req() req: AuthenticatedRequest
    // @Query() findAllTasksQueryDto: FindAllTasksQueryDto, // Placeholder for future query DTO
  ): Promise<TaskDto[]> {
    const user = req.user;
    // The service's findAllTasks expects organizationId
    const tasks = await this.tasksBackendService.findAllTasks(
      user.organizationId
      // findAllTasksQueryDto,
    );
    return tasks as unknown as TaskDto[]; // Cast if service returns entities
  }

  @Get(':id')
  public async findTaskById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest
  ): Promise<TaskDto> {
    const user = req.user;
    // Service method ensures task belongs to the organization
    const task = await this.tasksBackendService.findTaskById(
      id,
      user.organizationId
    );
    return task as unknown as TaskDto; // Cast if service returns entity
  }

  @Patch(':id')
  public async updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: AuthenticatedRequest
  ): Promise<TaskDto> {
    const user = req.user;

    // If organizationId is part of updateTaskDto, validate it (or prevent its change through this endpoint)
    if (
      updateTaskDto.organizationId &&
      updateTaskDto.organizationId !== user.organizationId
    ) {
      throw new ForbiddenException(
        'Cannot change the organization of a task or assign to a different organization.'
      );
    }
    // Ensure the update DTO doesn't try to change the organization ID if it's not allowed
    const { organizationId, ...restOfUpdateDto } = updateTaskDto;
    if (organizationId && organizationId !== user.organizationId) {
      // This check is somewhat redundant given the above, but good for explicit denial
      throw new ForbiddenException('Task organization cannot be changed.');
    }

    const updatedTask = await this.tasksBackendService.updateTask(
      id,
      restOfUpdateDto as UpdateTaskDto, // Pass DTO without orgId if it was present
      user.organizationId
    );
    return updatedTask as unknown as TaskDto; // Cast if service returns entity
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest
  ): Promise<void> {
    const user = req.user;
    await this.tasksBackendService.deleteTask(id, user.organizationId);
  }
}
