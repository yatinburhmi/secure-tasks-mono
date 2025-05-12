import { Test, TestingModule } from '@nestjs/testing';

// Mock TasksBackendService directly at the module level
// This prevents the real service with @InjectRepository from being loaded by Jest
// when TasksController imports it.
jest.mock('@secure-tasks-mono/tasks-backend', () => ({
  TasksBackendService: jest.fn().mockImplementation(() => ({
    // Provide mock implementations for all methods of TasksBackendService
    // that are used by TasksController in the methods you are testing.
    // For the current tests focusing on findAllTasks, this is the primary one.
    findAllTasks: jest.fn(),
    createTask: jest.fn(),
    findAllTasksAcrossOrganizations: jest.fn(),
    findTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    // Add any other methods from TasksBackendService if your controller uses them.
  })),
}));

// Mock the @secure-tasks-mono/auth library
// This is needed because TasksController uses @RequirePermissions decorator
jest.mock('@secure-tasks-mono/auth', () => {
  const originalAuthModule = jest.requireActual('@secure-tasks-mono/auth');

  // Mock PermissionsGuard as a class with a canActivate method
  class MockPermissionsGuard {
    canActivate = jest.fn(() => true);
  }

  return {
    ...originalAuthModule,
    RequirePermissions: jest.fn(() => jest.fn()), // Mock the decorator
    PermissionsGuard: MockPermissionsGuard, // Use the mock class directly
    // Define the permission constants
    PERM_TASK_CREATE: 'PERM_TASK_CREATE',
    PERM_TASK_UPDATE: 'PERM_TASK_UPDATE',
    PERM_TASK_DELETE: 'PERM_TASK_DELETE',
    PERM_TASK_VIEW_ALL_ORGS: 'PERM_TASK_VIEW_ALL_ORGS',
  };
});

// Mock the @secure-tasks-mono/data library
jest.mock('@secure-tasks-mono/data', () => {
  const originalDataModule = jest.requireActual('@secure-tasks-mono/data');
  return {
    ...originalDataModule, // Preserve DTO classes for type annotations if they are simple classes/interfaces
    // Explicitly define enums used in this test file
    TaskStatus: {
      PENDING: 'PENDING',
      IN_PROGRESS: 'IN_PROGRESS',
      COMPLETED: 'COMPLETED',
      // Add other statuses if your enum has more and they are used or could be used
    },
    // If FindAllTasksQueryDto or TaskDto were complex classes needing mocking, do it here.
    // For now, assuming they are interfaces or simple DTO classes that don't need special mock constructors.
  };
});

import { TasksController } from './tasks.controller';
import { TasksBackendService } from '@secure-tasks-mono/tasks-backend'; // This will now import the mocked version above for Jest
import {
  FindAllTasksQueryDto,
  TaskDto,
  TaskStatus,
} from '@secure-tasks-mono/data';
import { JwtPayload, PermissionsGuard } from '@secure-tasks-mono/auth';
import { AuthGuard } from '@nestjs/passport';

// This is the mock object that will be *injected* into the controller instance via NestJS DI.
// Its methods will be the ones actually called by the controller during tests.
const mockTasksBackendServiceInstance = {
  findAllTasks: jest.fn(),
  createTask: jest.fn(),
  findAllTasksAcrossOrganizations: jest.fn(),
  findTaskById: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
};

// Mock AuthGuard and PermissionsGuard
const mockAuthGuard = { canActivate: jest.fn(() => true) };
const mockPermissionsGuard = { canActivate: jest.fn(() => true) };

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksBackendService; // This will hold the injected mock instance

  beforeEach(async () => {
    // Clear mocks for the instance that will be injected
    Object.values(mockTasksBackendServiceInstance).forEach((mockFn) =>
      mockFn.mockClear()
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksBackendService, // Provide the actual token
          useValue: mockTasksBackendServiceInstance, // Use our instance mock for DI
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(PermissionsGuard)
      .useValue(mockPermissionsGuard)
      .compile();

    controller = module.get<TasksController>(TasksController);
    // service will be our mockTasksBackendServiceInstance due to useValue
    service = module.get<TasksBackendService>(TasksBackendService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllTasks', () => {
    const mockJwtPayload: JwtPayload = {
      sub: 'user-uuid-123',
      email: 'test@example.com',
      roleId: 1,
      organizationId: 'org-uuid-456',
    };

    const mockRequest = { user: mockJwtPayload };

    const mockTasksResult: TaskDto[] = [
      {
        id: 'task-uuid-1',
        title: 'Test Task 1',
        status: TaskStatus.PENDING,
        organizationId: 'org-uuid-456',
        creatorId: 'user-uuid-123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task-uuid-2',
        title: 'Test Task 2',
        status: TaskStatus.IN_PROGRESS,
        description: 'A description',
        assigneeId: 'user-uuid-assignee',
        organizationId: 'org-uuid-456',
        creatorId: 'user-uuid-123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // No longer need to clear mockTasksBackendService.findAllTasks here,
    // as mockTasksBackendServiceInstance.findAllTasks is cleared in the outer beforeEach.

    it('should call TasksBackendService.findAllTasks with organizationId and empty filters when no query params', async () => {
      const query: FindAllTasksQueryDto = {};
      // Set up the mock for the specific instance method
      mockTasksBackendServiceInstance.findAllTasks.mockResolvedValue(
        mockTasksResult
      );

      const result = await controller.findAllTasks(mockRequest, query);

      // Expect the injected service mock to have been called
      expect(service.findAllTasks).toHaveBeenCalledTimes(1);
      expect(service.findAllTasks).toHaveBeenCalledWith(
        mockJwtPayload.organizationId,
        {}, // Empty filters
        undefined // No searchTerm
      );
      expect(result).toEqual(mockTasksResult);
    });

    it('should call TasksBackendService.findAllTasks with assigneeId filter', async () => {
      const assigneeId = 'assignee-uuid-789';
      const query: FindAllTasksQueryDto = { assigneeId };
      mockTasksBackendServiceInstance.findAllTasks.mockResolvedValue(
        mockTasksResult
      );

      const result = await controller.findAllTasks(mockRequest, query);

      expect(service.findAllTasks).toHaveBeenCalledTimes(1);
      expect(service.findAllTasks).toHaveBeenCalledWith(
        mockJwtPayload.organizationId,
        { assigneeId },
        undefined // No searchTerm
      );
      expect(result).toEqual(mockTasksResult);
    });

    it('should call TasksBackendService.findAllTasks with searchTerm', async () => {
      const searchTerm = 'Test';
      const query: FindAllTasksQueryDto = { searchTerm };
      mockTasksBackendServiceInstance.findAllTasks.mockResolvedValue(
        mockTasksResult
      );

      const result = await controller.findAllTasks(mockRequest, query);

      expect(service.findAllTasks).toHaveBeenCalledTimes(1);
      expect(service.findAllTasks).toHaveBeenCalledWith(
        mockJwtPayload.organizationId,
        {}, // Empty filters
        searchTerm
      );
      expect(result).toEqual(mockTasksResult);
    });

    it('should call TasksBackendService.findAllTasks with both assigneeId and searchTerm', async () => {
      const assigneeId = 'assignee-uuid-789';
      const searchTerm = 'Urgent';
      const query: FindAllTasksQueryDto = { assigneeId, searchTerm };
      mockTasksBackendServiceInstance.findAllTasks.mockResolvedValue(
        mockTasksResult
      );

      const result = await controller.findAllTasks(mockRequest, query);

      expect(service.findAllTasks).toHaveBeenCalledTimes(1);
      expect(service.findAllTasks).toHaveBeenCalledWith(
        mockJwtPayload.organizationId,
        { assigneeId },
        searchTerm
      );
      expect(result).toEqual(mockTasksResult);
    });

    it('should return the result from TasksBackendService.findAllTasks', async () => {
      const query: FindAllTasksQueryDto = {};
      mockTasksBackendServiceInstance.findAllTasks.mockResolvedValue(
        mockTasksResult
      );

      const result = await controller.findAllTasks(mockRequest, query);
      expect(result).toEqual(mockTasksResult);
    });
  });
});
