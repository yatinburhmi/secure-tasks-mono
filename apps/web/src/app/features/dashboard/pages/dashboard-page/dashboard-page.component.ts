import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDto, TaskStatus } from '@secure-tasks-mono/data'; // Assuming path alias is set
import { TaskCardComponent } from '../../components/task-card/task-card.component'; // Import the new TaskCardComponent

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, TaskCardComponent], // Add TaskCardComponent to imports
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  pageTitle = 'Task Management'; // Initial title
  currentView: 'list' | 'board' = 'list'; // Default view

  statusFilters: string[] = ['All', ...Object.values(TaskStatus)]; // Use TaskStatus for filters
  selectedStatusFilter = 'All'; // Type will be inferred

  allTasks: TaskDto[] = [];
  pendingTasks: TaskDto[] = [];
  inProgressTasks: TaskDto[] = [];
  doneTasks: TaskDto[] = [];

  // Simple UUID generator for mock data
  private _generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  private _loadMockTasks(): void {
    this.allTasks = [
      {
        id: this._generateUUID(),
        title: 'Design a new dashboard layout',
        description:
          'Create mockups for the new dashboard design focusing on user experience.',
        status: TaskStatus.PENDING,
        creatorId: this._generateUUID(),
        organizationId: this._generateUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 'Design',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        tags: ['ui', 'ux', 'dashboard'],
      },
      {
        id: this._generateUUID(),
        title: 'Develop API endpoints for tasks',
        description: 'Implement CRUD operations for tasks in the backend.',
        status: TaskStatus.IN_PROGRESS,
        creatorId: this._generateUUID(),
        assigneeId: this._generateUUID(),
        organizationId: this._generateUUID(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        category: 'Backend',
      },
      {
        id: this._generateUUID(),
        title: 'Write unit tests for Auth module',
        description: 'Ensure 100% test coverage for the authentication module.',
        status: TaskStatus.DONE,
        creatorId: this._generateUUID(),
        assigneeId: this._generateUUID(),
        organizationId: this._generateUUID(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        category: 'Testing',
        tags: ['tests', 'auth'],
      },
      {
        id: this._generateUUID(),
        title: 'Review PR for feature X',
        description: 'Go through the pull request and provide feedback.',
        status: TaskStatus.PENDING,
        creatorId: this._generateUUID(),
        organizationId: this._generateUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 'Code Review',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      {
        id: this._generateUUID(),
        title: 'Deploy application to staging',
        description:
          'Prepare and deploy the latest build to the staging environment.',
        status: TaskStatus.IN_PROGRESS,
        creatorId: this._generateUUID(),
        organizationId: this._generateUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 'Deployment',
        tags: ['cicd', 'staging'],
      },
    ];
  }

  private _filterTasksByStatus(): void {
    this.pendingTasks = this.allTasks.filter(
      (task) => task.status === TaskStatus.PENDING
    );
    this.inProgressTasks = this.allTasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS
    );
    this.doneTasks = this.allTasks.filter(
      (task) => task.status === TaskStatus.DONE
    );
  }

  ngOnInit(): void {
    this._loadMockTasks();
    this._filterTasksByStatus();
    // Initialize statusFilters from TaskStatus enum
    this.statusFilters = ['All', ...Object.values(TaskStatus)];
    // console.log('All tasks loaded:', this.allTasks);
    // console.log('Pending tasks:', this.pendingTasks);
    // console.log('In Progress tasks:', this.inProgressTasks);
    // console.log('Done tasks:', this.doneTasks);
  }

  setView(view: 'list' | 'board'): void {
    this.currentView = view;
    this.pageTitle = view === 'board' ? 'Task Board' : 'Task Management';
  }

  selectStatusFilter(status: string): void {
    this.selectedStatusFilter = status;
    // TODO: Add logic to actually filter tasks when data is available
    // For now, this will apply to the 'list' view if we implement it there.
    // For the 'board' view, tasks are already segregated by status columns.
    console.log('Selected filter:', status);
    if (status === 'All') {
      this._filterTasksByStatus(); // Reset board view to show all tasks in their respective columns
    } else {
      // This specific filtering logic might be more applicable to a list view.
      // For the board, it's inherently filtered by columns.
      // However, if we wanted to "dim" other columns or similar, this could be a place.
      // For now, let's ensure the board columns are always populated correctly.
      this._filterTasksByStatus(); // Re-filter to ensure board columns are correct.
    }
  }

  // TODO: Implement other methods for filters, new task, etc.
}
