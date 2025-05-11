import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, User, Organization } from '@secure-tasks-mono/database';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
  FindAllTasksFiltersDto,
} from '@secure-tasks-mono/data';
import {
  AuditLogService,
  AUDIT_TASK_CREATED,
  AUDIT_TASK_UPDATED,
  AUDIT_TASK_DELETED,
} from '@secure-tasks-mono/audit-log-backend';

@Injectable()
export class TasksBackendService {
  private readonly logger = new Logger(TasksBackendService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly auditLogService: AuditLogService
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
    const {
      organizationId,
      assigneeId,
      status,
      dueDate,
      ...coreTaskProperties
    } = createTaskDto;

    if (!organizationId) {
      this.logger.error('Organization ID is missing in CreateTaskDto');
    }

    const taskDataForCreate: Partial<Task> = {
      ...coreTaskProperties,
      creator: { id: userId } as User,
      organization: { id: organizationId } as Organization,
      status: status || TaskStatus.PENDING,
    };

    if (assigneeId) {
      taskDataForCreate.assignee = { id: assigneeId } as User;
    }

    if (dueDate) {
      const parsedDueDate = new Date(dueDate);
      if (!isNaN(parsedDueDate.getTime())) {
        taskDataForCreate.dueDate = parsedDueDate;
      } else {
        this.logger.warn(
          `Invalid dueDate string received: ${dueDate}. Skipping dueDate assignment.`
        );
      }
    }

    const taskEntityInstance = this.taskRepository.create(taskDataForCreate);
    const savedTask = await this.taskRepository.save(taskEntityInstance);

    if (savedTask && organizationId) {
      this.auditLogService
        .createLog({
          userId,
          organizationId,
          action: AUDIT_TASK_CREATED,
          details: {
            taskId: savedTask.id,
            title: savedTask.title,
          },
        })
        .catch((err) =>
          this.logger.error('Failed to create audit log for task creation', err)
        );
    }

    return savedTask;
  }

  /**
   * Finds all tasks for a given organization, with optional filters.
   * @param organizationId - The organization's UUID.
   * @param filters - Optional filters (e.g., status, assigneeId).
   */
  public async findAllTasks(
    organizationId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filters?: FindAllTasksFiltersDto // Use the new DTO
  ): Promise<Task[]> {
    // Construct the where clause dynamically
    const whereClause: any = { organizationId }; // Start with organizationId

    if (filters?.assigneeId) {
      whereClause.assigneeId = filters.assigneeId; // Add assigneeId if present
    }

    return this.taskRepository.find({
      where: whereClause, // Use the dynamically constructed where clause
      // Add relations to load if needed: 'assignee', 'creator', 'organization'
      // Add order by, e.g., { createdAt: 'DESC' }
      relations: ['assignee', 'creator', 'organization'], // Eager load relations
      order: { createdAt: 'DESC' }, // Default ordering
    });
  }

  /**
   * Finds all tasks across all organizations. Intended for Owner-level access.
   */
  public async findAllTasksAcrossOrganizations(): Promise<Task[]> {
    this.logger.debug(
      'Fetching all tasks across all organizations for Owner role'
    );
    return this.taskRepository.find({
      // No organizationId filter here
      relations: ['assignee', 'creator', 'organization'], // Eager load relations
      order: { createdAt: 'DESC' }, // Default ordering
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
   * @param actorUserId - UUID of the user performing the update.
   */
  public async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    organizationId: string,
    actorUserId: string
  ): Promise<Task> {
    const task = await this.findTaskById(id, organizationId); // Ensures task exists and belongs to org

    // Destructure dueDate and get the rest of the properties
    const { dueDate, ...coreUpdateProperties } = updateTaskDto;

    // Initialize updatePayload with properties other than dueDate
    const updatePayload: Partial<Task> = {
      ...coreUpdateProperties,
    };

    // Handle dueDate conversion if it exists in the DTO
    if (dueDate) {
      const parsedDueDate = new Date(dueDate);
      if (!isNaN(parsedDueDate.getTime())) {
        updatePayload.dueDate = parsedDueDate; // Assign Date object
      } else {
        this.logger.warn(
          `Invalid dueDate string received for update: ${dueDate}. Skipping dueDate update.`
        );
        // No need to delete updatePayload.dueDate as it was never set with the string from DTO
      }
    }

    // Merge and save. TypeORM handles partial updates.
    this.taskRepository.merge(task, updatePayload); // Use the processed updatePayload
    const updatedTask = await this.taskRepository.save(task);

    // Audit log call
    this.auditLogService
      .createLog({
        userId: actorUserId,
        organizationId,
        action: AUDIT_TASK_UPDATED,
        details: {
          taskId: updatedTask.id,
          updatedFields: Object.keys(updateTaskDto), // Log original DTO keys for clarity
        },
      })
      .catch((err) =>
        this.logger.error('Failed to create audit log for task update', err)
      );

    return updatedTask;
  }

  /**
   * Deletes a task.
   * @param id - Task UUID.
   * @param organizationId - Organization UUID for scoping.
   * @param actorUserId - UUID of the user performing the deletion.
   */
  public async deleteTask(
    id: string,
    organizationId: string,
    actorUserId: string
  ): Promise<void> {
    const task = await this.findTaskById(id, organizationId); // Ensures task exists and belongs to org
    const taskDetailsForLog = { taskId: task.id, title: task.title }; // Capture before delete

    await this.taskRepository.remove(task);

    // Audit log call
    this.auditLogService
      .createLog({
        userId: actorUserId,
        organizationId,
        action: AUDIT_TASK_DELETED,
        details: taskDetailsForLog,
      })
      .catch((err) =>
        this.logger.error('Failed to create audit log for task deletion', err)
      );
  }
}
