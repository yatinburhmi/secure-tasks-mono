import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, User, Organization } from '@secure-tasks-mono/database';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
} from '@secure-tasks-mono/data';

@Injectable()
export class TasksBackendService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) {}

  /**
   * Creates a new task.
   * @param createTaskDto - Data to create the task.
   * @param userId - UUID of the user creating the task.
   */
  public async createTask(
    createTaskDto: CreateTaskDto,
    userId: string
  ): Promise<Task> {
    const { organizationId, assigneeId, status, ...coreTaskProperties } =
      createTaskDto;
    const taskDataForCreate: Partial<Task> = {
      ...coreTaskProperties,
      creator: { id: userId } as User,
      organization: { id: organizationId } as Organization,
      status: status || TaskStatus.PENDING,
    };

    if (assigneeId) {
      taskDataForCreate.assignee = { id: assigneeId } as User;
    }

    const taskEntityInstance = this.taskRepository.create(taskDataForCreate);
    return this.taskRepository.save(taskEntityInstance);
  }

  /**
   * Finds all tasks for a given organization, with optional filters.
   * @param organizationId - The organization's UUID.
   * @param filters - Optional filters (e.g., status, assigneeId).
   */
  public async findAllTasks(
    organizationId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filters?: any // Define a proper filter DTO later
  ): Promise<Task[]> {
    return this.taskRepository.find({
      where: { organizationId },
      // Add relations to load if needed: 'assignee', 'creator', 'organization'
      // Add order by, e.g., { createdAt: 'DESC' }
    });
  }

  /**
   * Finds a specific task by its ID, ensuring it belongs to the given organization.
   * @param id - Task UUID.
   * @param organizationId - Organization UUID for scoping.
   */
  public async findTaskById(id: string, organizationId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, organizationId },
      // Add relations to load if needed
    });
    if (!task) {
      throw new NotFoundException(
        `Task with ID "${id}" not found in organization "${organizationId}"`
      );
    }
    return task;
  }

  /**
   * Updates a task.
   * @param id - Task UUID.
   * @param updateTaskDto - Data for updating the task.
   * @param organizationId - Organization UUID for scoping and validation.
   */
  public async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    organizationId: string
  ): Promise<Task> {
    const task = await this.findTaskById(id, organizationId); // Ensures task exists and belongs to org

    // Merge and save. TypeORM handles partial updates.
    this.taskRepository.merge(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  /**
   * Deletes a task.
   * @param id - Task UUID.
   * @param organizationId - Organization UUID for scoping.
   */
  public async deleteTask(id: string, organizationId: string): Promise<void> {
    const task = await this.findTaskById(id, organizationId); // Ensures task exists and belongs to org
    await this.taskRepository.remove(task);
  }
}
