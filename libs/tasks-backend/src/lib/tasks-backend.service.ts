import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@secure-tasks-mono/database';
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
   * @param creatorId - UUID of the user creating the task.
   * @param organizationId - UUID of the organization the task belongs to.
   */
  public async createTask(
    createTaskDto: CreateTaskDto,
    creatorId: string
    // organizationId is part of CreateTaskDto, ensure it is used for validation/scoping
  ): Promise<Task> {
    // Basic validation (existence of org, assignee if provided) should happen here
    // For now, direct creation:
    const task = this.taskRepository.create({
      ...createTaskDto,
      creatorId,
      status: createTaskDto.status || TaskStatus.PENDING, // Example default if not in DTO
    });
    return this.taskRepository.save(task);
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
